import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * The Picker Button component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Button = ({
  disabled, label, openList, value,
}) => (
  <button
    className={`${disabled ? styles.buttonDisabled : styles.button}`}
    onClick={openList}
    type="button"
  >
    <span className={styles.label}>{label}</span>
    {value && <span className={styles.value}>{value}</span>}
  </button>
);

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
