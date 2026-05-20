import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()((theme, params, classes) => ({
  container: {
    position: 'relative',
    marginBottom: -4,
  },
  label: {
    display: 'block',
    height: 20,
    width: 44,
    background: '#898989',
    borderRadius: 100,
    cursor: 'pointer',
    bottom: -4,
    transition: 'all .3s ease',
  },
  thumb: {
    position: 'absolute',
    left: -2,
    top: -3,
    display: 'block',
    width: 26,
    height: 26,
    borderRadius: 100,
    background: 'white',
    boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0,0,0,.12)',
    transition: 'all .3s ease',
    pointerEvents: 'none',
    zIndex: 100,
  },
  checkbox: {
    [`&:checked ~ .${classes.label}`]: {
      background: 'var(--color-primary)',
      opacity: 0.5,
    },
    [`&:checked ~ .${classes.thumb}`]: {
      left: 20,
      background: 'var(--color-primary)',
    },
    [`&:disabled ~ .${classes.label}`]: {
      background: '#D5D5D5',
      pointerEvents: 'none',
      filter: 'none',
    },
    [`&:disabled ~ .${classes.thumb}`]: {
      background: '#BCBDBC',
      filter: 'none',
    },
    // a11y configuration: hide visually but keep interactive
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    margin: 0,
    zIndex: 2,
    cursor: 'pointer',
  },
}));
/**
 * The Toggle component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const Toggle = ({
  id, checked, className, onChange, disabled,
}) => {
  const { classes } = useStyles();

  return (
    <div className={className}>
      <div className={classes.container}>
        <input
          type="checkbox"
          id={id}
          className={classes.checkbox}
          checked={checked}
          aria-checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-labelledby={`${id}-label`}
        />
        <div className={classes.label} />
        <div className={classes.thumb} />
      </div>
    </div>
  );
};

Toggle.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

Toggle.defaultProps = {
  checked: false,
  className: null,
  onChange: null,
  disabled: false,
};

export default Toggle;
