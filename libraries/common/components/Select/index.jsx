import React, {
  useState, useEffect, useRef, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import SelectItem from './components/Item';

const DEFAULT_PLACEHOLDER_TEXT = 'Select ...';

const useStyles = makeStyles()(() => ({
  container: {
    margin: 0,
    padding: 0,
  },
  selectHandle: {
    float: 'right',
  },
  items: {
    position: 'absolute',
    width: '100%',
  },
}));

/**
 * Finds an item in a list of items by value.
 * @param {Array} items The list of items.
 * @param {*} value The value to look for.
 * @returns {*} The found item or undefined.
 */
const findItemByValue = (items, value) => (
  items.filter(item => item.value === value).shift()
);

/**
 * Converts an item of any type (e.g. string or number)
 * to an object representation containing value and label properties.
 * @param {*} item An item of any type.
 * @returns {Object} An object representation of the item.
 */
const normalizeItem = item => ({
  value: item.value || item,
  label: item.label || item.value || item,
});

/**
 * The select component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Select = ({
  className,
  items,
  onChange,
  placeholder,
  value,
}) => {
  const { classes, cx } = useStyles();
  const domElement = useRef(null);

  const [selected, setSelected] = useState(() => {
    if (!value) {
      return null;
    }
    return normalizeItem(findItemByValue(items, value));
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    const next = normalizeItem(findItemByValue(items, value));
    setSelected((prev) => {
      if (!prev || prev.value !== next?.value) {
        return next;
      }
      return prev;
    });
  }, [value, items]);

  useEffect(() => {
    // eslint-disable-next-line require-jsdoc
    const handleInteractionOutside = (event) => {
      if (domElement.current && !domElement.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('touchstart', handleInteractionOutside);
    return () => document.removeEventListener('touchstart', handleInteractionOutside);
  }, []);

  const triggerChangeCallback = useCallback((nextSelected) => {
    if (selected && selected.value === nextSelected.value) {
      return;
    }
    if (onChange instanceof Function) {
      onChange(nextSelected.value);
    }
  }, [onChange, selected]);

  const handleItemSelect = useCallback((itemValue, label) => {
    const stateUpdate = {
      label,
      value: itemValue,
    };
    triggerChangeCallback(stateUpdate);
    setSelected(stateUpdate);
    setIsOpen(false);
  }, [triggerChangeCallback]);

  const toggleOpenState = useCallback(() => {
    setIsOpen(open => !open);
  }, []);

  const hasSelection = selected && selected.value !== undefined;

  const selectedLabel = (hasSelection)
    ? selected.label
    : placeholder;

  const itemsMarkup = (isOpen) ? (
    <div className={classes.items}>
      {items.map((item) => {
        const normalizedItem = normalizeItem(item);
        const itemSelected = hasSelection && selected.value === normalizedItem.value;

        return (
          <SelectItem
            key={normalizedItem.value}
            value={normalizedItem.value}
            label={normalizedItem.label}
            selected={itemSelected}
            onSelect={handleItemSelect}
          />
        );
      })}
    </div>
  ) : null;

  return (
    <div className={cx(classes.container, className, 'common_select')} ref={domElement}>
      <div onTouchStart={toggleOpenState} role="presentation">
        <span>
          {selectedLabel}
        </span>
        <span className={classes.selectHandle}>
          &#9662;
        </span>
      </div>
      {itemsMarkup}
    </div>
  );
};

Select.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf((
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
    ])
  )),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Select.defaultProps = {
  className: '',
  items: [],
  onChange: () => {},
  placeholder: DEFAULT_PLACEHOLDER_TEXT,
  value: null,
};

export default memo(Select);
