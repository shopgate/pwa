/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseButton from '@shopgate/pwa-common/components/Button';
import styles from './style';

const buttonTypes = [
  'plain',
  'regular',
  'primary',
  'secondary',
];

/**
 * The basic button component. This components applies Material Design styles and acts as
 * base to more feature-rich button components such as ActionButton and RippleButton, but can
 * also be used as standalone component or any other kind of new button.
 */
class Button extends Component {
  static propTypes = {
    ...BaseButton.propTypes,
    className: PropTypes.string,
    flat: PropTypes.bool,
    type: PropTypes.oneOf(buttonTypes),
    wrapContent: PropTypes.bool,
  };

  static defaultProps = {
    ...BaseButton.defaultProps,
    className: '',
    flat: false,
    type: 'primary',
    wrapContent: true,
  };

  /**
   * Getter for style depending on prop type.
   * @returns {Object}
   */
  get style() {
    const { flat, disabled } = this.props;

    switch (this.props.type) {
      case 'plain':
        return styles.plain();
      case 'regular':
        return styles.regular(disabled);
      default:
      case 'primary':
        return styles.primary(disabled, flat);
      case 'secondary':
        return styles.secondary(disabled, flat);
    }
  }

  /**
   * Getter for the calculated button props.
   * @returns {Object}
   */
  get buttonProps() {
    const buttonProps = {
      className: this.props.className,
      disabled: this.props.disabled,
      onClick: this.props.onClick,
    };

    return buttonProps;
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const style = this.style;

    const content = this.props.wrapContent ? (
      <div className={style.content}>
        {this.props.children}
      </div>
    ) : this.props.children;

    return (
      <BaseButton {...this.buttonProps} className={`${style.button} ${this.props.className}`}>
        {content}
      </BaseButton>
    );
  }
}

export default Button;
