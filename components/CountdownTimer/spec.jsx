/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { shallow } from 'enzyme';
import CountdownTimer, { getFormattedTimeString } from './index';

describe('<CountdownTimer>', () => {
  jest.useFakeTimers();

  /**
   * Creates a new countdown timer element.
   * @param {number} remainingDays The remaining days.
   * @param {number} remainingHours The remaining hours.
   * @param {number} remainingMinutes The remaining minutes.
   * @param {number} remainingSeconds The remaining seconds.
   * @param {Function} callback The expiration callback.
   * @return {JSX}
   */
  const createTimerElement = (
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
    callback
  ) => {
    const timeout = Math.floor(Date.now() / 1000)
        + (remainingDays * 86400)
        + (remainingHours * 3600)
        + (remainingMinutes * 60)
        + remainingSeconds
      ;

    const wrapper = shallow(
      <CountdownTimer timeout={timeout} onExpire={callback} />
    );

    let currentTimeOffset = timeout - Math.floor(Date.now() / 1000);

    wrapper.instance().getRemainingTime = () => {
      currentTimeOffset -= 1;
      return currentTimeOffset;
    };

    wrapper.instance().componentDidMount();

    return wrapper;
  };

  /**
   * Performs a time format check for a specific remaining time.
   * @param {number} remainingDays The remaining days.
   * @param {number} remainingHours The remaining hours.
   * @param {number} remainingMinutes The remaining minutes.
   * @param {number} remainingSeconds The remaining seconds.
   */
  const performFormatCheck = (
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds
  ) => {
    jest.clearAllTimers();
    setInterval.mock.calls = [];

    const wrapper = createTimerElement(
      remainingDays,
      remainingHours,
      remainingMinutes,
      remainingSeconds,
      null
    );

    const expectedTimeFormat = getFormattedTimeString(
      remainingDays,
      remainingHours,
      remainingMinutes,
      remainingSeconds - 1 // Expect the decremented timeout.
    );

    // We cannot perform a snapshot match here because the timestamp changes for each call.
    expect(setInterval.mock.calls.length).toBe(1);

    jest.runTimersToTime(1000);

    const { params, string } = wrapper.props();
    const renderedTimeFormat = {
      params,
      string,
    };

    expect(renderedTimeFormat).toEqual(expectedTimeFormat);
  };

  it('should render the correct time for < 24h', () => performFormatCheck(0, 0, 0, 5));

  it('should render the correct time for 24h - 48h', () => performFormatCheck(1, 12, 6, 5));

  it('should render the correct time for > 2d', () => performFormatCheck(30, 1, 2, 3));

  it('should not render negative durations', () => {
    jest.clearAllTimers();

    const wrapper = createTimerElement(-1, -2, -3, -5, null);
    const expectedTimeFormat = getFormattedTimeString(0, 0, 0, 0);

    jest.runTimersToTime(1000);

    const { params, string } = wrapper.props();
    const renderedTimeFormat = {
      params,
      string,
    };

    expect(renderedTimeFormat).toEqual(expectedTimeFormat);
  });

  it('should stop at 00:00:00 when the timer expires', () => {
    const wrapper = createTimerElement(0, 0, 0, 1, null);
    const expectedTimeFormat = getFormattedTimeString(0, 0, 0, 0);

    let renderedTimeFormat;

    // Run down to 00:00:00.
    jest.runTimersToTime(1000);
    let { params, string } = wrapper.props();
    renderedTimeFormat = {
      params,
      string,
    };
    expect(renderedTimeFormat).toEqual(expectedTimeFormat);

    // Advance time a bit further and make sure the timer stays at 00:00:00.
    jest.runTimersToTime(1000);
    ({ params, string } = wrapper.props());
    renderedTimeFormat = {
      params,
      string,
    };

    expect(renderedTimeFormat).toEqual(expectedTimeFormat);
  });

  it('should invoke the callback when the timer expires', () => {
    let timesCallbackInvoked = 0;
    /**
     * The callback method will just increment a counter when invoked.
     */
    const callback = () => {
      timesCallbackInvoked += 1;
    };

    createTimerElement(0, 0, 0, 2, callback);

    // The timer is not expired yet. Make sure the callback is not invoked.
    jest.runTimersToTime(1000);
    expect(timesCallbackInvoked).toBe(0);

    // The timer should expire by now.
    jest.runTimersToTime(1000);
    expect(timesCallbackInvoked).toBe(1);

    // Run it again and make sure it won't be called twice.
    jest.runTimersToTime(1000);
    expect(timesCallbackInvoked).toBe(1);
  });

  it('should not invoke the callback when the timeout is already expired.', () => {
    let timesCallbackInvoked = 0;
    /**
     * The callback method will just increment a counter when invoked.
     */
    const callback = () => {
      timesCallbackInvoked += 1;
    };

    createTimerElement(0, 0, 0, 0, callback);

    jest.runTimersToTime(1000);
    expect(timesCallbackInvoked).toBe(0);
  });
});
