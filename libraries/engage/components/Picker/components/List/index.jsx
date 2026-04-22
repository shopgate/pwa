import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  button: {
    display: 'block',
    width: '100%',
    padding: '10px 20px',
    outline: 'none',
    textAlign: 'left',
  },
  active: {
    button: {
      fontWeight: 'bold',
    },
  },
});

/**
 * The default button for the Picker component.
 * @param {Object} props The component props.
 * @returns {JSX} The button component.
 */
const PickerList = (props) => {
  const { classes, cx } = useStyles();
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
    <ul className={cx('engage__picker_list', 'common__picker__list')}>
      {filteredItems.map((item, currentIndex) => (
        <li
          key={item.value}
          className={cx({
            [classes.active]: currentIndex === selectedIndex,
          })}
        >
          <button
            className={classes.button}
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
