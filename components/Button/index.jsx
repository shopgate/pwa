/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style';

/**
 * The button component.
 */
class Button extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    onClick: null,
  };

  /**
   * Getter for the calculated button props.
   * @returns {Object}
   */
  get buttonProps() {
    const buttonProps = {
      className: `${this.props.className} ${style}`,
      disabled: this.props.disabled,
      onClick: this.props.disabled ? null : this.props.onClick,
    };

    return buttonProps;
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    return (
      <button {...this.buttonProps}>
        {this.props.children}
      </button>
    );
  }
}

export default Button;
