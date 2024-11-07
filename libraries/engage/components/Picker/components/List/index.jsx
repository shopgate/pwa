import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * The default button for the Picker component.
 * @param {Object} props The component props.
 * @returns {JSX} The button component.
 */
const PickerList = (props) => {
  const {
    items, onClose, onSelect, selectedIndex, query,
  } = props;

  const filteredItems = useMemo(() => {
    if (!query || !query.length) {
      return items;
    }

    return items.filter(({ label = '' }) => {
      const searchLabel = label.replaceAll(' ', '').toLowerCase();
      const searchValue = query.replaceAll(' ', '').toLowerCase();
      return searchLabel.includes(searchValue);
    });
  }, [items, query]);
  return (
    <ul className="engage__picker_list">
      {filteredItems.map((item, currentIndex) => (
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

PickerList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  query: PropTypes.string,
  selectedIndex: PropTypes.number,
};

PickerList.defaultProps = {
  onClose: () => { },
  selectedIndex: null,
  query: '',
};

export default PickerList;
