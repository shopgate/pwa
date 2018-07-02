import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * 
 * @param {*} selected 
 * @param {*} selectable 
 */
const getStyle = (selected, selectable) => {
  if (selected) {
    return styles.buttonSelected;
  }

  if (!selectable) {
    return styles.buttonDisabled;
  }

  return styles.button;
};

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const SheetItem = ({ item, onClick, selected }) => {
  const props = {
    className: getStyle(selected, item.selectable),
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
  selected: PropTypes.bool,
};

SheetItem.defaultProps = {
  onClick() {},
  selected: false,
};

export default SheetItem;
