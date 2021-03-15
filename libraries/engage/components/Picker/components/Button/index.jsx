import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The default button for the Picker component.
 * @param {Object} props The component props.
 * @returns {JSX} The button component.
 */
const Button = ({ value, label, openList }) => (
  <button className={`${styles.button} engage__picker__button`} onClick={openList} type="button">
    <span className={styles.label}>{label}</span>
    {value !== null && (
      <span className={styles.value}>{value}</span>
    )}
  </button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  openList: PropTypes.func.isRequired,
  value: PropTypes.string,
};

Button.defaultProps = {
  value: null,
};

export default Button;
