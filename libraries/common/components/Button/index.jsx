import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(() => ({
  root: {
    '&:focus': {
      outline: 0,
    },
  },
}));

/**
 * The button component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Button = ({
  children,
  className,
  disabled,
  onClick,
  testId,
  ...rest
}) => {
  const { classes } = useStyles();

  const buttonProps = {
    className: `${className} ${classes.root} common__button`,
    disabled,
    onClick: disabled ? null : onClick,
    ...rest,
  };

  return (
    // eslint-disable-next-line react/button-has-type
    <button data-test-id={testId} {...buttonProps}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  testId: PropTypes.string,
};

Button.defaultProps = {
  className: '',
  disabled: false,
  onClick: null,
  testId: 'Button',
};

export default memo(Button);
