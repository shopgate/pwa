import React, {
  useRef, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import QuantityInput from '@shopgate/engage/components/QuantityInput';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()(() => ({
  inputStyle: {
    border: 'none',
    background: colors.placeholder,
    display: 'block',
    fontSize: '0.75rem',
    lineHeight: 1,
    textAlign: 'center',
    padding: `${variables.gap.small * 0.75}px ${variables.gap.small}px`,
    outline: 0,
    width: '100%',
    borderRadius: 4,
  },
}));

/**
 * The Quantity Picker component (unstyled export for tests).
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
export function CartItemQuantityPicker({
  disabled,
  editMode,
  hasCatchWeight,
  onChange,
  onToggleEditMode,
  quantity,
  unit,
}) {
  const { classes } = useStyles();
  const input = useRef(null);

  useEffect(() => {
    if (editMode && input.current) {
      input.current.focus();
    }
  }, [editMode]);

  useEffect(() => {
    const el = input.current;
    if (!el) {
      return undefined;
    }

    // eslint-disable-next-line require-jsdoc
    const onContextMenu = (event) => {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };

    el.addEventListener('contextmenu', onContextMenu);
    return () => el.removeEventListener('contextmenu', onContextMenu);
  }, []);

  const handleInputClick = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();

    if (onToggleEditMode) {
      onToggleEditMode(true);
    }
  }, [onToggleEditMode]);

  const handleInputFocus = useCallback(() => {
    if (onToggleEditMode) {
      onToggleEditMode(true);
    }
  }, [onToggleEditMode]);

  const handleSubmitForm = useCallback((event) => {
    event.preventDefault();
    if (input.current) {
      input.current.blur();
    }
  }, []);

  const handleInputBlur = useCallback((event, newQuantity) => {
    if (onToggleEditMode) {
      onToggleEditMode(false);
    }

    if (quantity !== newQuantity && onChange) {
      onChange(newQuantity);
    }
  }, [onChange, onToggleEditMode, quantity]);

  const hasCustomUnit = (unit && hasCatchWeight) || false;

  return (
    <form onSubmit={handleSubmitForm} className="theme__cart__product__quantity-picker">
      <QuantityInput
        ref={input}
        className={classes.inputStyle}
        value={quantity}
        onClick={handleInputClick}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        unit={hasCustomUnit ? unit : null}
        maxDecimals={hasCustomUnit ? 2 : 0}
        data-test-id="quantityPicker"
        disabled={disabled}
        aria-label={i18n.text('product.quantity')}
      />
    </form>
  );
}

CartItemQuantityPicker.propTypes = {
  disabled: PropTypes.bool,
  editMode: PropTypes.bool,
  hasCatchWeight: PropTypes.bool,
  onChange: PropTypes.func,
  onToggleEditMode: PropTypes.func,
  quantity: PropTypes.number,
  unit: PropTypes.string,
};

CartItemQuantityPicker.defaultProps = {
  editMode: false,
  onChange: () => {},
  unit: null,
  quantity: 1,
  onToggleEditMode: () => {},
  disabled: false,
  hasCatchWeight: false,
};

export default CartItemQuantityPicker;
