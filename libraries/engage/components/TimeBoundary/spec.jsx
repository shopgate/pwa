/* eslint-disable extra-rules/no-single-line-objects */
import React from 'react';
import { mount } from 'enzyme';
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
    jest.clearAllMocks();
  });

  it('should render valid time span', () => {
    expect.assertions(1);
    // -30sec < wrapper < +30sec
    mount((
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
    mount((
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
    const wrapper = mount((
      <TimeBoundary start={new Date(nowMs - 30000)} end={new Date(nowMs + 2000)}>
        {children}
      </TimeBoundary>
    ));
    const checkBoundaryMethod = wrapper.instance().checkBoundary;
    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy).toHaveBeenCalledWith(checkBoundaryMethod);

    // Simulate time is over
    jest.spyOn(Date, 'now').mockReturnValue(new Date(nowMs + 3000));
    // simulate rxjs emitting
    checkBoundaryMethod();

    wrapper.update();
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);

    expect(children.mock.calls).toEqual([
      [{ after: false, before: false, between: false }],
      [{ after: false, before: false, between: true }],
      [{ after: true, before: false, between: false }],
    ]);
  });
});
/* eslint-enable extra-rules/no-single-line-objects */
