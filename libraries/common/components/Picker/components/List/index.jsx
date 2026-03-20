import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
    '& button': {
      fontWeight: 'bold',
    },
  },
});

/**
 * The default button for the Picker component.
 * @returns {JSX} The button component.
 */
const PickerList = ({
  items,
  onClose,
  onSelect,
  selectedIndex,
}) => {
  const { classes } = useStyles();

  return (
    <ul className="common__picker__list">
      {items.map((item, currentIndex) => (
        <li
          key={item.value}
          className={classNames({ [classes.active]: currentIndex === selectedIndex })}
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
  selectedIndex: PropTypes.number,
};

PickerList.defaultProps = {
  onClose: () => {},
  selectedIndex: null,
};

export default PickerList;
