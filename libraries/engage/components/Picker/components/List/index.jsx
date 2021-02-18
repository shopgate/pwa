import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * The default button for the Picker component.
 * @param {Object} props The component props.
 * @returns {JSX} The button component.
 */
const List = (props) => {
  const {
    items, onClose, onSelect, selectedIndex,
  } = props;

  return (
    <ul className="engage__picker_list">
      {items.map((item, currentIndex) => (
        <li
          key={item.value}
          className={classNames({
            [styles.active]: currentIndex === selectedIndex,
          })}
        >
          <button
            className={styles.button}
            disabled={item.disabled}
            onClick={() => {
              onSelect(item.value);
              onClose();
            }}
            type="button"
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  selectedIndex: PropTypes.number,
};

List.defaultProps = {
  onClose: () => { },
  selectedIndex: null,
};

export default List;
