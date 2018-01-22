/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import styles from './style';

const duration = 300;

const transitionStyles = {
  entering: {
    transform: 'scale(1, 1)',
  },
  entered: {
    transform: 'scale(1, 1)',
  },
  exited: {
    transform: 'scale(1, 0)',
  },
  exiting: {
    transform: 'scale(1, 0)',
  },
};

/**
 * A component for visualizing any kind of progress.
 * This component will show the current progress in a linear bar.
 */
class ProgressBar extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
  };

  static defaultProps = {
    isVisible: true,
  };

  /**
   * The constructor
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: props.isVisible,
      isVisible: props.isVisible,
    };
  }

  /**
   * Update the state based on props.
   * @param {Object} nextProps The next set of props.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.isVisible === nextProps.isVisible) {
      return;
    }

    this.setState({
      ...nextProps.isVisible && { isAnimating: true },
      isVisible: nextProps.isVisible,
    });
  }

  /**
   * Only update when certain state changes are made.
   * @param {Object} nextProps The next set of props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.isAnimating !== nextState.isAnimating ||
      this.state.isVisible !== nextState.isVisible
    );
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const animationClasses = [
      styles.innerElement,
    ];

    // Add the animation if we need it.
    if (this.state.isAnimating) {
      animationClasses.push(styles.animating);
    }

    return (
      <Transition
        in={this.state.isVisible}
        timeout={duration}
        onExited={() => { this.setState({ isAnimating: false }); }}
      >
        {state => (
          <div
            className={styles.wrapper}
            style={transitionStyles[state]}
          >
            <div className={animationClasses.join(' ')} />
          </div>
        )}
      </Transition>
    );
  }
}

export default ProgressBar;
