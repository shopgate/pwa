import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const SheetItem = ({ item, onClick }) => {
  const props = {
    className: !item.selectable ? styles.buttonDisabled : styles.button,
    key: item.id,
    value: item.id,
    ...item.selectable && { onClick },
  };

  return (
    <button {...props}>
      {item.label}
    </button>
  );
};

SheetItem.propTypes = {
  item: PropTypes.shape().isRequired,
  onClick: PropTypes.func,
};

SheetItem.defaultProps = {
  onClick() {},
};

export default SheetItem;
