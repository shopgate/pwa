/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * Drawer component.
 */
class Drawer extends Component {
  /**
   * The component prop types.
   * @type {Object}
   */
  static propTypes = {
    alwaysActive: PropTypes.bool,
    animation: PropTypes.shape({
      duration: PropTypes.number,
      in: PropTypes.string,
      out: PropTypes.string,
    }),
    children: PropTypes.node,
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onDidClose: PropTypes.func,
    onOpen: PropTypes.func,
  };

  /**
   * The component default props.
   * @type {Object}
   */
  static defaultProps = {
    alwaysActive: false,
    className: '',
    children: null,
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
    onDidClose: () => {},
    animation: {
      duration: null,
      in: '',
      out: '',
    },
  };

  /**
   * Initializes the Drawer component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);

    this.state = {
      active: props.isOpen,
    };
  }

  /**
   * Update state when isOpen changes.
   * @param {Object} nextProps The next component props.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      if (nextProps.isOpen) {
        if (typeof nextProps.onOpen === 'function') {
          nextProps.onOpen();
        }
        this.setState({ active: true });
      } else if (typeof nextProps.onClose === 'function') {
        nextProps.onClose();
      }
    }
  }

  /**
   * Syncs the internal active state when an animation ends.
   */
  handleAnimationEnd = () => {
    this.setState({ active: this.props.isOpen });
    this.props.onDidClose();
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      alwaysActive,
      className,
      children,
      isOpen,
      animation,
    } = this.props;
    const { active } = this.state;

    const animationIn = animation.in || styles.animation.in;
    const animationOut = animation.out || styles.animation.out;

    const combinedClassName = classNames(
      className,
      styles.container,
      { [animationIn]: isOpen },
      { [animationOut]: !isOpen }
    );

    const style = {};
    if (typeof animation.duration === 'number') {
      style.animationDuration = `${animation.duration}ms`;
    }

    return (active || alwaysActive) ? (
      <div
        className={combinedClassName}
        style={style}
        onAnimationEnd={this.handleAnimationEnd}
      >
        {children}
      </div>
    ) : null;
  }
}

export default Drawer;
