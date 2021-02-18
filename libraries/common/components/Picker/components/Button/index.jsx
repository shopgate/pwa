import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The default button for the Picker component.
 * @returns {JSX} The button component.
 */
const Button = ({ value, label, openList }) => {
  if (value !== null) {
    return (
      <button className={styles.button} onClick={openList} type="button">
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </button>
    );
  }

  return (
    <button className={styles.button} onClick={openList} type="button">
      <span className={styles.label}>{label}</span>
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  openList: PropTypes.func.isRequired,
  value: PropTypes.string,
};

Button.defaultProps = {
  value: null,
};

export default Button;
