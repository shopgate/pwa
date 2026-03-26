import React, {
  useRef, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { SheetList, Picker as BasePicker, Sheet } from '@shopgate/engage/components';
import { ViewContext } from '@shopgate/engage/components/View';
import { makeStyles } from '@shopgate/engage/styles';
import Button from './components/Button';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    minHeight: 56,
  },
}));

/**
 * The template version of the Picker component (inner).
 * @param {Object} props The same component props as in the base Picker component.
 * @param {Function} props.setViewAriaHidden View a11y callback from context.
 * @returns {JSX.Element}
 */
const PickerInner = (props) => {
  const {
    setViewAriaHidden,
    hasButton,
    sheetProps: sheetPropsProp,
    clickDelay,
    buttonComponent,
    buttonProps,
    label,
    ...restProps
  } = props;

  const { classes } = useStyles();
  const pickerRef = useRef(null);
  const firstSelectableItemRef = useRef(null);

  const onDidOpen = useCallback(() => {
    setViewAriaHidden(true);
    if (firstSelectableItemRef.current) {
      firstSelectableItemRef.current.focus();
    }
  }, [setViewAriaHidden]);

  const onClose = useCallback(() => {
    setViewAriaHidden(false);
    if (pickerRef.current) {
      pickerRef.current.focus();
    }
  }, [setViewAriaHidden]);

  const modalComponent = useCallback(sheetPropsIn => (
    <Sheet
      {...{
        ...sheetPropsProp,
        ...sheetPropsIn,
      }}
      title={label}
      onDidOpen={onDidOpen}
    />
  ), [sheetPropsProp, label, onDidOpen]);

  const listComponent = useCallback(prps => (
    <SheetList>
      {prps.items.map((item, index) => (
        <SheetList.Item
          key={item.value}
          title={item.label}
          onClick={() => {
            setTimeout(() => {
              prps.onSelect(item.value);
              prps.onClose();
            }, clickDelay);
          }}
          isDisabled={item.disabled}
          isSelected={index === prps.selectedIndex}
          rightComponent={item.rightComponent}
          testId={item.label}
          ref={index === prps.selectedIndex ? firstSelectableItemRef : null}
        />
      ))}
    </SheetList>
  ), [clickDelay]);

  return (
    <BasePicker
      {...restProps}
      label={label}
      className={hasButton ? classes.root : ''}
      modalComponent={modalComponent}
      buttonProps={buttonProps}
      buttonComponent={buttonComponent || Button}
      listComponent={listComponent}
      onClose={onClose}
      ref={pickerRef}
    />
  );
};

PickerInner.propTypes = {
  label: PropTypes.string.isRequired,
  setViewAriaHidden: PropTypes.func.isRequired,
  buttonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  buttonProps: PropTypes.shape(),
  clickDelay: PropTypes.number,
  hasButton: PropTypes.bool,
  sheetProps: PropTypes.shape(),
};

PickerInner.defaultProps = {
  buttonComponent: null,
  buttonProps: {},
  /**
   * Time in ms that delays picker interaction in order
   * to let animations complete first.
   */
  clickDelay: 150,
  hasButton: true,
  sheetProps: {},
};

/**
 * @param {Object} props Picker props.
 * @returns {JSX.Element}
 */
const Picker = props => (
  <ViewContext.Consumer>
    {({ setAriaHidden }) => (
      <PickerInner {...props} setViewAriaHidden={setAriaHidden} />
    )}
  </ViewContext.Consumer>
);

export default Picker;
