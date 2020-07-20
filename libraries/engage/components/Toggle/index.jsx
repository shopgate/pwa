import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  label, checkbox, hidden, root,
} from './style';

/**
 * The TextLink component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const Toggle = ({
  id, checked, className, onChange, disabled,
}) => (
  <div className={classNames(root, className)}>
    <input type="checkbox" id={id} className={classNames(checkbox, hidden)} checked={checked} onChange={onChange} disabled={disabled} />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor={id} className={label} />
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
  className: undefined,
  onChange: undefined,
  disabled: false,
};

export default Toggle;
