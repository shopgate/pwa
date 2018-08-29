import React from 'react';
import PropTypes from 'prop-types';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const ValueButton = ({
  id, label, isActive, onClick,
}) => {
  if (!label || !id) {
    return null;
  }

  return (
    <button className={isActive ? styles.active : styles.container} onClick={() => onClick(id)}>
      {label}
    </button>
  );
};

ValueButton.propTypes = {
  id: PropTypes.string,
  isActive: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

ValueButton.defaultProps = {
  id: null,
  label: null,
  isActive: false,
  onClick() { },
};

export default ValueButton;
