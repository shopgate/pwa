import { render } from '@testing-library/react';
import { viewScroll$ } from '@shopgate/engage/core/streams';
import useScrollDirectionChange from './useScrollDirectionChange';
import type { UseScrollDirectionChangeParams, ViewScrollEvent } from './useScrollDirectionChange';

jest.mock('@shopgate/engage/core/streams', () => ({
  viewScroll$: { subscribe: jest.fn() },
}));

const mockedSubscribe = viewScroll$.subscribe as jest.Mock;
const mockedUnsubscribe = jest.fn();

/**
 * Builds a scroll event, including the internal properties the stream adds.
 * @param direction The direction the view scrolled in.
 * @param scrollTop The scroll position the event reports.
 * @returns The scroll event.
 */
const scrollEvent = (
  direction: ViewScrollEvent['direction'],
  scrollTop: number
): ViewScrollEvent => ({
  event: {} as UIEvent,
  scrollTop,
  previousScrollTop: 0,
  scrollDown: direction === 'down',
  scrollUp: direction === 'up',
  direction,
  scrolled: true,
  scrollIn: false,
  scrollOut: false,
});

// Renders the hook and returns the emit function the stream subscription received.
const renderHook = (params: UseScrollDirectionChangeParams) => {
  let emit: ((event: ViewScrollEvent) => void) | undefined;

  mockedSubscribe.mockImplementation((handler) => {
    emit = handler;
    return { unsubscribe: mockedUnsubscribe };
  });

  const Consumer = () => {
    useScrollDirectionChange(params);
    return null;
  };

  const rendered = render(<Consumer />);

  return { emit: (event: ViewScrollEvent) => emit?.(event), ...rendered };
};

describe('engage > core > hooks > events > useScrollDirectionChange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not subscribe while it is disabled', () => {
    renderHook({ enabled: false, onScrollUp: jest.fn() });

    expect(mockedSubscribe).not.toHaveBeenCalled();
  });

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook({ enabled: true });

    unmount();

    expect(mockedUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should report a downward scroll past the offset', () => {
    const onScrollDown = jest.fn();
    const { emit } = renderHook({ enabled: true, onScrollDown });

    emit(scrollEvent('down', 150));

    expect(onScrollDown).toHaveBeenCalledTimes(1);
  });

  it('should ignore a downward scroll before the offset', () => {
    const onScrollDown = jest.fn();
    const { emit } = renderHook({ enabled: true, onScrollDown });

    emit(scrollEvent('down', 50));

    expect(onScrollDown).not.toHaveBeenCalled();
  });

  it('should honour a custom offset', () => {
    const onScrollDown = jest.fn();
    const { emit } = renderHook({ enabled: true, offset: 20, onScrollDown });

    emit(scrollEvent('down', 50));

    expect(onScrollDown).toHaveBeenCalledTimes(1);
  });

  // The callbacks are meant to drive UI that reacts to a change of direction, not to every event.
  it('should report a direction only once until it changes', () => {
    const onScrollDown = jest.fn();
    const onScrollUp = jest.fn();
    const { emit } = renderHook({ enabled: true, onScrollDown, onScrollUp });

    emit(scrollEvent('down', 150));
    emit(scrollEvent('down', 200));
    expect(onScrollDown).toHaveBeenCalledTimes(1);

    emit(scrollEvent('up', 150));
    expect(onScrollUp).toHaveBeenCalledTimes(1);

    emit(scrollEvent('down', 200));
    expect(onScrollDown).toHaveBeenCalledTimes(2);
  });

  it('should report every event once onlyFireOnDirectionChange is off', () => {
    const onScrollDown = jest.fn();
    const { emit } = renderHook({
      enabled: true,
      onlyFireOnDirectionChange: false,
      onScrollDown,
    });

    emit(scrollEvent('down', 150));
    emit(scrollEvent('down', 200));

    expect(onScrollDown).toHaveBeenCalledTimes(2);
  });

  it('should hold back an upward scroll away from the top when asked to', () => {
    const onScrollUp = jest.fn();
    const { emit } = renderHook({
      enabled: true,
      onlyFireOnScrollUpAtTop: true,
      onScrollUp,
    });

    emit(scrollEvent('up', 50));
    expect(onScrollUp).not.toHaveBeenCalled();

    emit(scrollEvent('up', 0));
    expect(onScrollUp).toHaveBeenCalledTimes(1);
  });

  it('should allow an upward scroll within the top offset', () => {
    const onScrollUp = jest.fn();
    const { emit } = renderHook({
      enabled: true,
      onlyFireOnScrollUpAtTop: true,
      onlyFireOnScrollUpAtTopOffset: 100,
      onScrollUp,
    });

    emit(scrollEvent('up', 80));

    expect(onScrollUp).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['the view did not scroll', { ...scrollEvent('down', 150), scrolled: false }],
    ['there is no direction', scrollEvent(null, 150)],
  ])('should ignore an event where %s', (_, event) => {
    const onScrollDown = jest.fn();
    const { emit } = renderHook({ enabled: true, onScrollDown });

    emit(event);

    expect(onScrollDown).not.toHaveBeenCalled();
  });

  // The stream's internal bookkeeping is not part of what a consumer subscribes to.
  it('should strip the internal properties before handing the event over', () => {
    const onScrollDown = jest.fn();
    const { emit } = renderHook({ enabled: true, onScrollDown });

    emit(scrollEvent('down', 150));

    const [received] = onScrollDown.mock.calls[0];
    expect(received).not.toHaveProperty('scrolled');
    expect(received).not.toHaveProperty('scrollIn');
    expect(received).not.toHaveProperty('scrollOut');
    expect(received).toMatchObject({ direction: 'down', scrollTop: 150 });
  });
});
