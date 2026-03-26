import React from 'react';
import PropTypes from 'prop-types';
import BaseButton from '@shopgate/pwa-common/components/Button';
import { makeStyles, cx } from '@shopgate/engage/styles';
import Ripple from '../Ripple';
import Button from '../Button';

const BUTTON_TYPES = [
  'plain',
  'regular',
  'simple',
  'primary',
  'secondary',
];

const useStyles = makeStyles()(theme => ({
  contentWrapper: {
    padding: theme.spacing(0, 2, 0),
  },
}));

/**
 * The ripple button component is a special derivation of the basic button component
 * that adds a ripple effect when clicked.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const RippleButton = ({
  children,
  className,
  disabled,
  flat,
  onClick,
  rippleClassName,
  rippleSize,
  testId,
  type,
  'aria-label': ariaLabel,
  'aria-haspopup': ariaHaspopup,
}) => {
  const { classes } = useStyles();

  const buttonProps = {
    className: `${className} ui-shared__ripple-button`,
    disabled,
    onClick,
    flat,
    type,
    wrapContent: false,
    'aria-label': ariaLabel,
    'aria-haspopup': ariaHaspopup,
  };

  if (disabled) {
    return (
      <Button {...buttonProps} wrapContent>
        {children}
      </Button>
    );
  }

  const rippleProps = {
    className: cx(classes.contentWrapper, rippleClassName),
    fill: true,
    size: rippleSize,
    overflow: true,
  };

  return (
    <Button {...buttonProps} testId={testId}>
      <Ripple {...rippleProps}>
        {children}
      </Ripple>
    </Button>
  );
};

RippleButton.propTypes = {
  ...BaseButton.propTypes,
  className: PropTypes.string,
  flat: PropTypes.bool,
  rippleClassName: PropTypes.string,
  rippleSize: PropTypes.number,
  testId: PropTypes.string,
  type: PropTypes.oneOf(BUTTON_TYPES),
  wrapContent: PropTypes.bool,
};

RippleButton.defaultProps = {
  ...BaseButton.defaultProps,
  className: '',
  flat: false,
  type: 'primary',
  wrapContent: true,
  testId: 'Button',
  rippleClassName: '',
  rippleSize: null,
};

export default RippleButton;
