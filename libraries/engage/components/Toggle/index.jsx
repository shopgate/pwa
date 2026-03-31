import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
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
  labelChecked: {
    background: 'var(--color-primary)',
    opacity: 0.5,
  },
  labelDisabled: {
    background: '#D5D5D5',
    pointerEvents: 'none',
    filter: 'none',
  },
  checkbox: {
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
  thumbChecked: {
    left: 20,
    background: 'var(--color-primary)',
  },
  thumbDisabled: {
    background: '#BCBDBC',
    filter: 'none',
  },
});

/**
 * The Toggle component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const Toggle = ({
  id, checked, className, onChange, disabled,
}) => {
  const { classes, cx } = useStyles();

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
        <div
          className={cx(
            classes.label,
            checked && classes.labelChecked,
            disabled && classes.labelDisabled
          )}
        />
        <div
          className={cx(
            classes.thumb,
            checked && classes.thumbChecked,
            disabled && classes.thumbDisabled
          )}
        />
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
