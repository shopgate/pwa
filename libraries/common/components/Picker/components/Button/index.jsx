import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The default button for the Picker component.
 * @returns {JSX} The button component.
 */
const PickerButton = ({ value, label, openList }) => {
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

PickerButton.propTypes = {
  label: PropTypes.string.isRequired,
  openList: PropTypes.func.isRequired,
  value: PropTypes.string,
};

PickerButton.defaultProps = {
  value: null,
};

export default PickerButton;
