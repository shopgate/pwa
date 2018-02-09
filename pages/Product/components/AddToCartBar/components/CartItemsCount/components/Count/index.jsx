/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import styles, { duration, transition } from './style';

/**
 * The Count component.
 */
class Count extends Component {
  static propTypes = {
    count: PropTypes.number,
  };

  static defaultProps = {
    count: 1,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      in: false,
      numItems: props.count,
    };
  }

  isShown(nextProps) {
    if (this.props.numItems > 0 && nextProps.numItems === 0) {
      return false;
    }

    if (nextProps.numItems === 0) {
      return false;
    }

    return true;
  }

  /**
   * Sets the animation state if props change.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.count !== nextProps.count) {
      console.warn('COUNT', nextProps.count);
      this.setState({
        in: this.isShown(nextProps),
        numItems: nextProps.count,
      });
    }
  }

  /**
   * Only update if the cart product count changed.
   * @param {Object} nextProps The next props.
   * @param {Object} nextState The next state.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.in !== nextState.in ||
      this.state.numItems !== nextState.numItems
    );
  }

  handleOnExited = () => {
    this.setState({ in: true });
  }

  /**
   * Render the component.
   * @return {JSX}
   */
  render() {
    return (
      <Transition in={this.state.in} timeout={duration} onExited={this.handleOnExited}>
        {state => (
          <div className={styles.container} style={transition[state]}>
            {this.state.numItems} items added
          </div>
        )}
      </Transition>
    );
  }
}

export default Count;
