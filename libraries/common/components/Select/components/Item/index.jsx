import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The select item component.
 * @param {Object} props - The component props.
 * @param {React.Children} props.children - Some content to display inside.
 * @returns {JSX}
 */
const SelectItem = props => (
  <div
    className={`${styles} ${props.className}`}
    onTouchEnd={() => props.onSelect(props.value, props.label)}
  >
    {props.label}
  </div>
);

/**
 * The component prop types.
 * @type {Object}
 */
SelectItem.propTypes = {
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  className: PropTypes.string,
};

/**
 * The component default props.
 * @type {Object}
 */
SelectItem.defaultProps = {
  className: '',
};

export default SelectItem;
