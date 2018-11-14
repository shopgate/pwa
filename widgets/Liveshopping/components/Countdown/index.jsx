import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CountdownNow from 'react-countdown-now';
import TimeRemaining from '../TimeRemaining';

/**
 * The Countdown component.
 */
class Countdown extends Component {
  static propTypes = {
    to: PropTypes.number.isRequired,
  }

  state = {
    interval: 1000,
  };

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {bool}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.interval !== nextState.interval;
  }

  /**
   * 
   */
  updateInterval = () => {
    const { interval } = this.state;
    let newInterval;

    // Detect what interval should be using time remaining.

    if (newInterval !== interval) {
      return;
    }

    this.setState({ interval: newInterval });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { to } = this.props;
    const { interval } = this.state;

    return (
      <CountdownNow
        date={to}
        intervalDelay={interval}
        onTick={this.updateInterval}
        renderer={({ total }) => <TimeRemaining timestamp={total} />}
      />
    );
  }
}

export default Countdown;
