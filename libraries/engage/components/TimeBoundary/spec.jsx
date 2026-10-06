/* eslint-disable extra-rules/no-single-line-objects */
import { render, act } from '@testing-library/react';
import { second$ } from '@shopgate/pwa-common/streams/interval';
import TimeBoundary from './index';

describe('<TimeBoundary>', () => {
  const nowMs = new Date().getTime();
  let subscription;
  let subscribeSpy;
  let children;

  beforeEach(() => {
    subscription = {
      unsubscribe: jest.fn(),
    };
    subscribeSpy = jest.spyOn(second$, 'subscribe').mockReturnValue(subscription);
    children = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render valid time span', () => {
    expect.assertions(1);
    // -30sec < wrapper < +30sec
    render((
      <TimeBoundary start={new Date(nowMs - 30000)} end={new Date(nowMs + 30000)}>
        {children}
      </TimeBoundary>
    ));
    expect(children).toHaveBeenCalledWith({
      before: false,
      between: true,
      after: false,
    });
  });

  it('should not render expired time span', () => {
    expect.assertions(1);
    // -60sec < wrapper < -30sec
    render((
      <TimeBoundary start={new Date(nowMs - 60000)} end={new Date(nowMs - 30000)}>
        {children}
      </TimeBoundary>
    ));
    expect(children).toHaveBeenCalledWith({
      before: false,
      between: false,
      after: true,
    });
  });

  it('should hide after time span expired', () => {
    expect.assertions(4);
    // -30sec < wrapper < +2sec
    render((
      <TimeBoundary start={new Date(nowMs - 30000)} end={new Date(nowMs + 2000)}>
        {children}
      </TimeBoundary>
    ));
    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy).toHaveBeenCalledWith(expect.any(Function));
    const [[checkBoundary]] = subscribeSpy.mock.calls;

    // Simulate time is over
    jest.spyOn(Date, 'now').mockReturnValue(nowMs + 3000);
    // simulate rxjs emitting
    act(() => {
      checkBoundary();
    });

    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);

    expect(children.mock.calls).toEqual([
      [{ after: false, before: false, between: false }],
      [{ after: false, before: false, between: true }],
      [{ after: true, before: false, between: false }],
    ]);
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
