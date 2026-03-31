import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { SheetList, Picker as BasePicker, Sheet } from '@shopgate/engage/components';
import { ViewContext } from '@shopgate/engage/components/View';
import Button from './components/Button';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(1),
    minHeight: 56,
  },
}));

/**
 * The template version of the Picker component.
 * @param {Object} props The same component props as in the base Picker component.
 * @returns {JSX.Element}
 */
const PickerUtilize = ({
  label,
  setViewAriaHidden,
  buttonComponent,
  buttonProps,
  clickDelay,
  hasButton,
  sheetProps,
  ...restProps
}) => {
  const { classes, cx } = useStyles();
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

  const modalComponent = useCallback(sheetPropsInner => (
    <Sheet
      {...{
        ...sheetProps,
        ...sheetPropsInner,
      }}
      title={label}
      onDidOpen={onDidOpen}
    />
  ), [label, onDidOpen, sheetProps]);

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
      className={cx(hasButton ? classes.root : '', 'engage__picker-utilize')}
      modalComponent={modalComponent}
      buttonProps={buttonProps}
      buttonComponent={buttonComponent || Button}
      listComponent={listComponent}
      onClose={onClose}
      ref={pickerRef}
    />
  );
};

PickerUtilize.propTypes = {
  label: PropTypes.string.isRequired,
  setViewAriaHidden: PropTypes.func.isRequired,
  buttonComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  buttonProps: PropTypes.shape(),
  clickDelay: PropTypes.number,
  hasButton: PropTypes.bool,
  sheetProps: PropTypes.shape(),
};

PickerUtilize.defaultProps = {
  buttonComponent: null,
  buttonProps: {},
  clickDelay: 150,
  hasButton: true,
  sheetProps: {},
};

export default props => (
  <ViewContext.Consumer>
    {({ setAriaHidden }) => (
      <PickerUtilize {...props} setViewAriaHidden={setAriaHidden} />
    )}
  </ViewContext.Consumer>
);
