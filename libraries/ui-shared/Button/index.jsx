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
    testId: PropTypes.string,
    type: PropTypes.oneOf(buttonTypes),
    wrapContent: PropTypes.bool,
  };

  static defaultProps = {
    ...BaseButton.defaultProps,
    className: '',
    flat: false,
    type: 'primary',
    wrapContent: true,
    testId: 'Button',
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
    const {
      className, disabled, onClick, testId, type, wrapContent, flat, ...rest
    } = this.props;

    const buttonProps = {
      className,
      disabled,
      onClick,
      ...rest,
    };

    return buttonProps;
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { style } = this;

    const content = this.props.wrapContent ? (
      <div className={style.content}>
        {this.props.children}
      </div>
    ) : this.props.children;

    return (
      <BaseButton {...this.buttonProps} className={`${style.button} ${this.props.className}`} testId={this.props.testId}>
        {content}
      </BaseButton>
    );
  }
}

export default Button;
