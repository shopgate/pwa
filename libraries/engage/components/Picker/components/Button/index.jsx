import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The default button for the Picker component.
 * @param {Object} props The component props.
 * @returns {JSX} The button component.
 */
const PickerButton = ({ value, label, openList }) => (
  <button className={styles.button} onClick={openList} type="button">
    <span className={styles.label}>{label}</span>
    {value !== null && (
      <span className={styles.value}>{value}</span>
    )}
  </button>
);

PickerButton.propTypes = {
  label: PropTypes.string.isRequired,
  openList: PropTypes.func.isRequired,
  value: PropTypes.string,
};

PickerButton.defaultProps = {
  value: null,
};

export default PickerButton;
