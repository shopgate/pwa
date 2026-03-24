import React, {
  useState, useEffect, useRef, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import find from 'lodash/find';
import { makeStyles } from '@shopgate/engage/styles';
import Dropdown from '../Dropdown';
import I18n from '../I18n';
import SelectBoxItem from './components/Item';

const useStyles = makeStyles()(() => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    zIndex: 1,
    outline: 0,
  },
}));

/**
 * The select box component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const SelectBox = ({
  icon: Icon,
  item: Item,
  items,
  className,
  classNames: classNamesProp,
  defaultText,
  duration,
  handleSelectionUpdate,
  initialValue,
  testId,
}) => {
  const { classes } = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(() => find(items, { value: initialValue }));
  const controlRef = useRef(null);
  const firstItemRef = useRef(null);

  useEffect(() => {
    setSelected(find(items, { value: initialValue }));
  }, [initialValue, items]);

  const handleInteractionOutside = useCallback((event) => {
    setIsOpen(false);
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleOpenList = useCallback(() => {
    if (isOpen) {
      return;
    }

    setIsOpen(true);

    if (firstItemRef.current) {
      firstItemRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectionUpdateInner = useCallback((value) => {
    const selection = find(items, { value });

    setSelected(selection);
    setIsOpen(false);

    setTimeout(() => {
      handleSelectionUpdate(selection.value);
    }, duration);

    if (controlRef.current) {
      controlRef.current.focus();
    }
  }, [duration, handleSelectionUpdate, items]);

  // eslint-disable-next-line require-jsdoc
  const setControlRef = (ref) => {
    controlRef.current = ref;
  };

  // eslint-disable-next-line require-jsdoc
  const setFirstItemRef = (ref) => {
    firstItemRef.current = ref;
  };

  const {
    icon: iconClass,
    iconOpen = null,
    selection,
    button,
    dropdown,
    selectItem,
    selectItemSelected,
  } = classNamesProp;

  const buttonLabel = selected ? selected.label : defaultText;

  return (
    <div className={`${className} common__select-box`} data-test-id={testId}>
      <button
        className={button}
        onClick={handleOpenList}
        data-test-id={buttonLabel}
        type="button"
        aria-haspopup
        aria-expanded={isOpen ? true : null}
        aria-controls={buttonLabel}
        ref={setControlRef}
      >
        <span className={selection}>
          <I18n.Text string={buttonLabel} />
        </span>
        <div className={classNames(iconClass, { [iconOpen]: (isOpen && iconOpen !== null) })}>
          <Icon />
        </div>
      </button>
      <Dropdown
        className={dropdown}
        isOpen={isOpen}
        duration={duration}
      >
        <ul role="menu" id={buttonLabel} tabIndex="-1">
          {items.map(item => (
            <SelectBoxItem
              classNames={{
                selectItem,
                selectItemSelected,
              }}
              wrapper={Item}
              key={item.value}
              value={item.value}
              label={item.label}
              handleSelectionUpdate={handleSelectionUpdateInner}
              isSelected={buttonLabel === item.label}
              forwardedRef={buttonLabel === item.label ? setFirstItemRef : null}
            />
          ))}
        </ul>
      </Dropdown>
      {isOpen && (
        <button
          className={classes.overlay}
          onClick={handleInteractionOutside}
          onTouchMove={handleInteractionOutside}
          type="button"
          aria-hidden
        />
      )}
    </div>
  );
};

SelectBox.propTypes = {
  icon: PropTypes.func.isRequired,
  item: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  className: PropTypes.string,
  classNames: PropTypes.objectOf(PropTypes.string),
  defaultText: PropTypes.string,
  duration: PropTypes.number,
  handleSelectionUpdate: PropTypes.func,
  initialValue: PropTypes.string,
  testId: PropTypes.string,
};

SelectBox.defaultProps = {
  className: '',
  classNames: {},
  duration: 225,
  defaultText: 'filter.sort.default',
  handleSelectionUpdate: () => {},
  initialValue: null,
  testId: null,
};

export default memo(SelectBox);
