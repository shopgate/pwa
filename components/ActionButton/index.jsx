/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IndicatorCircle from 'Components/IndicatorCircle';
import RippleButton from 'Components/RippleButton';
import styles from './style';

/**
 * The action button component.
 */
class ActionButton extends Component {
  static propTypes = {
    ...RippleButton.propTypes,
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    noGap: PropTypes.bool,
  };

  static defaultProps = {
    ...RippleButton.defaultProps,
    loading: false,
    type: 'primary',
    flat: true,
    noGap: false,
  };

  static clickDelay = 300;

  /**
   * The click handler
   * @param {Object} event The event object for the click handler
   */
  handleClick = (event) => {
    const { clickDelay } = this.constructor;

    setTimeout(() => {
      this.props.onClick(event);
    }, clickDelay);
  };

  /**
   * Getter for the calculated button props.
   * @returns {Object}
   */
  get buttonProps() {
    const buttonProps = {
      className: this.props.className,
      disabled: this.props.disabled,
      flat: this.props.flat,
      type: this.props.type,
    };

    return buttonProps;
  }

  /**
   * The render function.
   * @returns {JSX}
   */
  render() {
    const containerClass = this.props.noGap ? styles.noGapContainer : styles.container;

    if (this.props.loading) {
      return (
        <div className={styles.containerCircle}>
          <IndicatorCircle />
        </div>
      );
    }

    return (
      <div className={containerClass}>
        <RippleButton {...this.buttonProps} onClick={this.handleClick}>
          {this.props.children}
        </RippleButton>
      </div>
    );
  }
}

export default ActionButton;
