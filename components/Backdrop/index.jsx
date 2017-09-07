/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-inline-transition-group';
import styles from './style';

/**
 * Backdrop component.
 */
class Backdrop extends Component {
  /**
   * The component prop types.
   * @type {Object}
   */
  static propTypes = {
    color: PropTypes.string,
    duration: PropTypes.number,
    isVisible: PropTypes.bool,
    level: PropTypes.number,
    onClick: PropTypes.func,
    opacity: PropTypes.number,
  };

  /**
   * The component default props.
   * @type {Object}
   */
  static defaultProps = {
    color: '#000',
    duration: 200,
    isVisible: false,
    level: 2,
    onClick: () => {},
    opacity: 50,
  };

  /**
   * Only update when the `isVisible` prop changes.
   * @param {Object} nextProps The next set of component props.
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (this.props.isVisible !== nextProps.isVisible);
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const opacity = (this.props.opacity / 100);

    const transition = {
      base: {
        background: this.props.color,
        opacity: 0,
        transition: `opacity ${this.props.duration}ms ease-out`,
        zIndex: this.props.level,
      },
      appear: {
        opacity,
      },
      enter: {
        opacity,
      },
      leave: {
        opacity: 0,
      },
    };

    return (
      <Transition childrenStyles={transition}>
        {this.props.isVisible ?
          <div aria-hidden className={styles} onClick={this.props.onClick} /> : null
        }
      </Transition>
    );
  }
}

export default Backdrop;
