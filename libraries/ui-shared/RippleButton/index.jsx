import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseButton from '@shopgate/pwa-common/components/Button';
import { withStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Ripple from '../Ripple';
import Button from '../Button';

const buttonContentPadding = `0 ${themeConfig.variables.gap.big}px 0`;

const BUTTON_TYPES = [
  'plain',
  'regular',
  'simple',
  'primary',
  'secondary',
];

/**
 * The ripple button component is a special derivation of the basic button component
 * that adds a ripple effect when clicked.
 */
class RippleButton extends Component {
  static propTypes = {
    ...BaseButton.propTypes,
    className: PropTypes.string,
    flat: PropTypes.bool,
    nativeType: PropTypes.oneOf(['button', 'submit', 'reset']),
    rippleClassName: PropTypes.string,
    rippleSize: PropTypes.number,
    testId: PropTypes.string,
    type: PropTypes.oneOf(BUTTON_TYPES),
    wrapContent: PropTypes.bool,
  };

  static defaultProps = {
    ...BaseButton.defaultProps,
    className: '',
    flat: false,
    type: 'primary',
    wrapContent: true,
    testId: 'Button',
    rippleClassName: '',
    rippleSize: null,
    nativeType: undefined,
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
      nativeType: this.props.nativeType,
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

    const classes = withStyles.getClasses(this.props);

    const rippleProps = {
      className: `${classes.contentWrapper} ${this.props.rippleClassName}`,
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

const StyledRippleButton = withStyles(RippleButton, () => ({
  contentWrapper: {
    padding: buttonContentPadding,
  },
}));

StyledRippleButton.propTypes = RippleButton.propTypes;
StyledRippleButton.defaultProps = RippleButton.defaultProps;

export default StyledRippleButton;
