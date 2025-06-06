import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  label, checkbox, thumb, container,
} from './style';

/**
 * The Toggle component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const Toggle = ({
  id, checked, className, onChange, disabled,
}) => (
  <div className={className}>
    <div className={container}>
      <input
        type="checkbox"
        id={id}
        className={classNames(checkbox)}
        checked={checked}
        aria-checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-labelledby={`${id}-label`}
      />
      <div className={label} />
      <div className={thumb} />
    </div>
  </div>
);

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
