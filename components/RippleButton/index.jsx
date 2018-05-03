import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ripple from '@shopgate/pwa-ui-shared/Ripple';
import Button from 'Components/Button';
import style from 'Components/Button/style';

/**
 * The ripple button component is a special derivation of the basic button component
 * that adds a ripple effect when clicked.
 */
class RippleButton extends Component {
  static propTypes = {
    ...Button.propTypes,
    rippleClassName: PropTypes.string,
    rippleSize: PropTypes.number,
  };

  static defaultProps = {
    ...Button.defaultProps,
    rippleClassName: '',
    rippleSize: null,
  };

  /**
   * Getter for the calculated button props.
   * @returns {Object}
   */
  get buttonProps() {
    return {
      className: this.props.className,
      disabled: this.props.disabled,
      onClick: this.props.onClick,
      flat: this.props.flat,
      type: this.props.type,
      wrapContent: false,
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
    };

    return (
      <Button {...this.buttonProps}>
        <Ripple {...rippleProps}>
          {this.props.children}
        </Ripple>
      </Button>
    );
  }
}

export default RippleButton;
