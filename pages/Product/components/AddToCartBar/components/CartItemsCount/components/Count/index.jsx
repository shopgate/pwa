/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import PropTypes from 'prop-types';

const duration = 300;

const transitionStyles = {
  entering: {
    transform: 'translate3d(0, 200%, 0)',
  },
  entered: {
    transform: 'translate3d(0, 0, 0)',
  },
  exiting: {
    transform: 'translate3d(0, 0, 0)',
  },
  exited: {
    transform: 'translate3d(0, 0, 0)',
  },
};

/**
 * The Count component.
 */
class Count extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      in: false,
    };
  }

  /**
   * Sets the animation state if props change.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.count !== nextProps.count) {
      this.setState({
        in: true,
      });
    }
  }

  /**
   * Returns the default style.
   * @return {Object}
   */
  get defaultStyle() {
    const { count } = this.props;

    return {
      transition: `transform ${duration}ms ease-in-out`,
      transform: count ? 'translate3d(0, 0, 0)' : 'translate3d(0, 200%, 0)',
    };
  }

  /**
   * Handles the onEntered event.
   */
  handleOnEntered = () => {
    this.setState({
      in: false,
    });
  }

  /**
   * Render the component.
   * @return {JSX}
   */
  render() {
    const { count } = this.props;

    return (
      <Transition id={this.state.in} timeout={duration} onEntered={this.handleOnEntered}>
        {state => (
          <div
            style={{
              ...this.defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {count} items added
          </div>
        )}
      </Transition>
    );
  }
}

export default Count;
