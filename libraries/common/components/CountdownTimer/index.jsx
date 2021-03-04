import React, { Component } from 'react';
import PropTypes from 'prop-types';
import padStart from 'lodash/padStart';
import I18n from '../I18n';

/**
 * Creates the appropriate format for a given time period.
 * @param {number} days The remaining days.
 * @param {number} hours The remaining hours.
 * @param {number} minutes The remaining minutes.
 * @param {number} seconds The remaining seconds.
 * @return {Object} String and params for the i18n component
 */
export const getFormattedTimeString = (
  days,
  hours,
  minutes,
  seconds
) => {
  const formattedHours = padStart(hours, 2, '0');
  const formattedMinutes = padStart(minutes, 2, '0');
  const formattedSeconds = padStart(seconds, 2, '0');
  const hourlyFormat = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  return {
    string: 'common.countdown',
    params: {
      days,
      time: hourlyFormat,
    },
  };
};

/**
 * Creates a formatted duration string for a given time span represented as unix time stamp.
 * @param {number} timeSpanInput The remaining time span (in seconds).
 * @return {Object} String and params for the I18n component
 */
const createFormattedTime = (timeSpanInput) => {
  const timeSpan = Math.max(0, timeSpanInput);

  // Calculate remaining days, hours, minutes and seconds.
  const days = Math.floor(timeSpan / 86400);
  const hours = Math.floor((timeSpan % 86400) / 3600);
  const minutes = Math.floor((timeSpan % 3600) / 60);
  const seconds = timeSpan % 60;

  return getFormattedTimeString(days, hours, minutes, seconds);
};

/**
 * The Countdown timer component.
 */
class CountdownTimer extends Component {
  static propTypes = {
    timeout: PropTypes.number.isRequired,
    className: PropTypes.string,
    onExpire: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    onExpire: null,
  };

  /**
   * The component constructor.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.intervalHandle = null;
    this.remainingTime = this.getRemainingTime();
    this.expired = this.remainingTime <= 0;

    // Calculate the initial formatted time string.
    this.state = {
      formattedTime: createFormattedTime(this.remainingTime),
    };
  }

  /**
   * Installs a new interval to update the timer if the component did mount.
   */
  componentDidMount() {
    // Install the interval.
    this.intervalHandle = setInterval(() => {
      /**
       * To allow mocked tests of the timing functions and still be able to deal
       * with paused execution, the delta time is expected to be at least 1.
       */
      this.remainingTime = this.getRemainingTime();
      this.updateTimer();
    }, 1000);
  }

  /**
   * Clears the timer interval.
   */
  componentWillUnmount() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
  }

  /**
   * @returns {number} The remaining time until the timer runs out.
   */
  getRemainingTime() {
    return Math.ceil(this.props.timeout - (Date.now() / 1000));
  }

  /**
   * Updates the formatted time. Will not cause a re-rendering of the component.
   */
  updateTimer() {
    // Calculate the remaining time until the timer is expired. Also ignore negative durations.
    const deltaTime = Math.max(0, this.remainingTime);
    const isExpired = deltaTime <= 0;

    if (isExpired && !this.expired) {
      this.expired = true;

      // Clear the interval.
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;

      // The timer just expired, invoke the callback.
      if (this.props.onExpire) {
        this.props.onExpire();
      }
    }

    this.setState({
      formattedTime: createFormattedTime(deltaTime),
    });
  }

  /**
   * Renders the element.
   * @return {JSX}
   */
  render() {
    return (
      <I18n.Text
        string={this.state.formattedTime.string}
        params={this.state.formattedTime.params}
        className={`${this.props.className} common__countdown-timer`}
      />
    );
  }
}

export default CountdownTimer;
