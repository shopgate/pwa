// eslint-disable extra-rules/potential-point-free
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { isBefore, isAfter, isBetween } from '../../helpers/date';
import { minute$ } from '../../streams/interval';

/**
 * The TimeBoundary component.
 * @example
 *    <TimeBoundary
 *      start={new Date('2019-04-10T11:01:00.000Z')}
 *      end={new Date('2019-04-10T12:01:00.000Z')}
 *     >
 *       {({ before, between, after }) => (
           {between && <div>Content in between</div>}
        )}
 *     </TimeBoundary>
 */
class TimeBoundary extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
  };

  /**
   * @inheritDoc
   */
  constructor(props) {
    super(props);

    this.state = {
      before: false,
      between: false,
      after: false,
    };
  }

  /**
   * @inheritDoc
   */
  componentDidMount() {
    this.intervalSubscription = minute$.subscribe(this.checkBoundary);
    this.checkBoundary();
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    this.clear();
  }

  /** Clear interval if valid */
  clear = () => {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  /**
   * Check time boundary.
   */
  checkBoundary = () => {
    const now = Date.now();

    const newState = {
      before: isBefore(now, this.props.start),
      between: isBetween(now, this.props.start, this.props.end),
      after: isAfter(now, this.props.end),
    };
    if (isEqual(newState, this.state)) {
      return;
    }
    this.setState(newState);
    if (newState.after) {
      // already after, stop timer
      this.clear();
    }
  }

  /**
   * @return {JSX}
   */
  render() {
    return (
      <Fragment>
        {this.props.children(this.state)}
      </Fragment>
    );
  }
}

export default TimeBoundary;
// eslint-enable extra-rules/potential-point-free
