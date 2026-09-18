import { render } from '@testing-library/react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import useLongPress from './useLongPress';
import type { LongPressHandlers, UseLongPressOptions } from './useLongPress';

// Renders the hook and returns the handlers it produced.
const renderHook = (callback: () => void, options?: UseLongPressOptions) => {
  let handlers: LongPressHandlers | undefined;

  const Consumer = () => {
    handlers = useLongPress(callback, options);
    return null;
  };

  render(<Consumer />);

  return handlers as LongPressHandlers;
};

// Only `preventDefault` is ever read off the event, so a stub carries everything the hook needs.
const pressEvent = () => ({ preventDefault: jest.fn() } as unknown as ReactMouseEvent);

describe('engage > core > hooks > events > useLongPress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should fire the callback once the threshold elapsed', () => {
    const callback = jest.fn();
    const handlers = renderHook(callback);

    handlers.onMouseDown(pressEvent());
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should honour a custom threshold', () => {
    const callback = jest.fn();
    const handlers = renderHook(callback, { threshold: 4000 });

    handlers.onMouseDown(pressEvent());
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['onMouseUp'],
    ['onMouseLeave'],
    ['onTouchEnd'],
  ] as const)('should not fire when the press ended through %s', (ender) => {
    const callback = jest.fn();
    const onCancel = jest.fn();
    const handlers = renderHook(callback, { onCancel });

    handlers.onMouseDown(pressEvent());
    jest.advanceTimersByTime(500);
    handlers[ender](pressEvent());
    jest.advanceTimersByTime(5000);

    expect(callback).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  // The press already completed, so ending it is not a cancellation.
  it('should not report a cancel once the callback fired', () => {
    const onCancel = jest.fn();
    const handlers = renderHook(jest.fn(), { onCancel });

    handlers.onMouseDown(pressEvent());
    jest.advanceTimersByTime(1000);
    handlers.onMouseUp(pressEvent());

    expect(onCancel).not.toHaveBeenCalled();
  });

  it('should report the start and the finish of a press', () => {
    const onStart = jest.fn();
    const onFinish = jest.fn();
    const handlers = renderHook(jest.fn(), { onStart, onFinish });

    handlers.onMouseDown(pressEvent());
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onFinish).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should start a press from a touch just like from a mouse', () => {
    const callback = jest.fn();
    const handlers = renderHook(callback);

    handlers.onTouchStart(pressEvent());
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should suppress the native context menu', () => {
    const handlers = renderHook(jest.fn());
    const event = pressEvent();

    handlers.onContextMenu(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });
});
