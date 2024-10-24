import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ripple from '../Ripple';
import Button from '../Button';
import style from '../Button/style';

/**
 * The ripple button component is a special derivation of the basic button component
 * that adds a ripple effect when clicked.
 */
class RippleButton extends Component {
  static propTypes = {
    ...Button.propTypes,
    rippleClassName: PropTypes.string,
    rippleSize: PropTypes.number,
    testId: PropTypes.string,
  };

  static defaultProps = {
    ...Button.defaultProps,
    rippleClassName: '',
    rippleSize: null,
    testId: 'Button',
  };

  /**
   * Getter for the calculated button props.
   * @returns {Object}
   */
  get buttonProps() {
    return {
      className: `${this.props.className} ui-shared__ripple-button`,
      disabled: this.props.disabled,
      onClick: this.props.onClick,
      flat: this.props.flat,
      type: this.props.type,
      wrapContent: false,
      'aria-label': this.props['aria-label'],
      'aria-haspopup': this.props['aria-haspopup'],
    };
  }

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    if (this.props.disabled) {
      // Don't show the ripple effect when the button is disabled.
      return (
        <Button {...this.buttonProps} wrapContent>
          {this.props.children}
        </Button>
      );
    }

    const rippleProps = {
      className: `${style.contentWrapper} ${this.props.rippleClassName}`,
      fill: true,
      size: this.props.rippleSize,
      overflow: true,
    };

    return (
      <Button {...this.buttonProps} testId={this.props.testId}>
        <Ripple {...rippleProps}>
          {this.props.children}
        </Ripple>
      </Button>
    );
  }
}

export default RippleButton;
