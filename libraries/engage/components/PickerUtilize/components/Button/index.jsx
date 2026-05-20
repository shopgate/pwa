import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;

const useStyles = makeStyles()((theme) => {
  const buttonDefaults = {
    display: 'block',
    width: '100%',
    padding: theme.spacing(1, 2),
    fontFamily: 'inherit',
    textAlign: 'left',
    lineHeight: 1.2,
    outline: 'none',
    background: colors.shade8,
  };

  return {
    button: {
      ...buttonDefaults,
    },
    buttonDisabled: {
      ...buttonDefaults,
      color: colors.shade4,
    },
    label: {
      display: 'block',
      fontWeight: 500,
      ':not(:only-child)': {
        fontWeight: 400,
        fontSize: '0.75rem',
        marginBottom: 4,
      },
    },
    value: {
      display: 'block',
      fontWeight: 500,
    },
  };
});

/**
 * The Picker Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Button = ({
  disabled, label, openList, value,
}) => {
  const { classes, cx } = useStyles();

  return (
    <button
      className={cx(disabled ? classes.buttonDisabled : classes.button)}
      onClick={openList}
      type="button"
    >
      <span className={classes.label}>{label}</span>
      {value && <span className={classes.value}>{value}</span>}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]).isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  openList: PropTypes.func,
};

Button.defaultProps = {
  disabled: false,
  openList: () => {},
};

export default Button;
