import { render, act } from '@testing-library/react';
import I18n from '../I18n';
import CountdownTimer, { getFormattedTimeString } from './index';

jest.mock('../I18n', () => ({
  __esModule: true,
  default: { Text: jest.fn(() => null) },
}));

describe('<CountdownTimer>', () => {
  jest.useFakeTimers();

  let intervalSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    intervalSpy = jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    intervalSpy.mockRestore();
  });

  /**
   * Renders a new countdown timer element.
   * @param {number} remainingDays The remaining days.
   * @param {number} remainingHours The remaining hours.
   * @param {number} remainingMinutes The remaining minutes.
   * @param {number} remainingSeconds The remaining seconds.
   * @param {Function} callback The expiration callback.
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
      + remainingSeconds;

    render(<CountdownTimer timeout={timeout} onExpire={callback} />);
  };

  /**
   * @returns {Object} The translation the timer currently shows.
   */
  const getRenderedTime = () => {
    const { params, string } = I18n.Text.mock.lastCall[0];

    return {
      params,
      string,
    };
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

    createTimerElement(
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
      remainingSeconds - 1
    );

    expect(intervalSpy).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getRenderedTime()).toEqual(expectedTimeFormat);
  };

  it('should render the correct time for < 24h', () => performFormatCheck(0, 0, 0, 5));

  it('should render the correct time for 24h - 48h', () => performFormatCheck(1, 12, 6, 5));

  it('should render the correct time for > 2d', () => performFormatCheck(30, 1, 2, 3));

  it('should not render negative durations', () => {
    jest.clearAllTimers();

    createTimerElement(-1, -2, -3, -5, null);
    const expectedTimeFormat = getFormattedTimeString(0, 0, 0, 0);

    expect(getRenderedTime()).toEqual(expectedTimeFormat);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getRenderedTime()).toEqual(expectedTimeFormat);
  });

  it('should stop at 00:00:00 when the timer expires', () => {
    createTimerElement(0, 0, 0, 1, null);
    const expectedTimeFormat = getFormattedTimeString(0, 0, 0, 0);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getRenderedTime()).toEqual(expectedTimeFormat);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getRenderedTime()).toEqual(expectedTimeFormat);
  });

  it('should invoke the callback when the timer expires', () => {
    const callback = jest.fn();

    createTimerElement(0, 0, 0, 2, callback);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(0);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not invoke the callback when the timeout is already expired.', () => {
    const callback = jest.fn();

    createTimerElement(0, 0, 0, 0, callback);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
