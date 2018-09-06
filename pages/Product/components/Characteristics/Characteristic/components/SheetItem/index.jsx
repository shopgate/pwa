import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

/**
 * @param {boolean} selected Whether or not the item is selected.
 * @param {boolean} selectable Whether or not the item can be selected.
 * @returns {string}
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
const SheetItem = ({
  item,
  onClick,
  rightComponent: Right,
  selected,
}) => {
  const props = {
    className: getStyle(selected, item.selectable),
    key: item.id,
    value: item.id,
    ...item.selectable && { onClick },
  };

  return (
    <button {...props}>
      {item.label}
      {item.selectable && <Right />}
    </button>
  );
};

SheetItem.propTypes = {
  item: PropTypes.shape().isRequired,
  onClick: PropTypes.func,
  rightComponent: PropTypes.func,
  selected: PropTypes.bool,
};

SheetItem.defaultProps = {
  onClick() {},
  rightComponent: null,
  selected: false,
};

export default SheetItem;
