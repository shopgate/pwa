import React, {
  useCallback, useEffect, useState, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { i18n, hasNewServices } from '@shopgate/engage/core/helpers';
import { UIEvents } from '@shopgate/engage/core';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/engage';
import { RippleButton, QuantityInput } from '@shopgate/engage/components';
import { broadcastLiveMessage } from '@shopgate/engage/a11y/helpers';

const { variables, colors } = themeConfig;

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    zIndex: 5,
  }).toString(),
  backdrop: css({
    zIndex: 4,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    position: 'fixed',
  }),
  input: ({ inputColor, inputBgColor }) => css({
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
    flex: 1,
    fontSize: 15,
    height: '100%',
    width: '100%',
    backgroundColor: `var(--color-background-accent, ${colors.shade8})`,
    ...(inputColor && { color: `${inputColor} !important` }),
    ...(inputBgColor && { backgroundColor: `${inputBgColor} !important` }),
  }).toString(),
  inputWrapper: css({
    width: '100%',
  }),
  button: ({ size = 'default', buttonColor, buttonBgColor }) => {
    const sizeValue = size === 'large' ? 36 : 28;

    return css({
      width: sizeValue,
      ' &&': {
        minWidth: sizeValue,
        padding: 0,
      },
      height: sizeValue,
      fontSize: `${Math.floor((sizeValue / 28) * 100)}% !important`,
      ...(buttonColor && { color: `${buttonColor} !important` }),
      ...(buttonBgColor && { backgroundColor: `${buttonBgColor} !important` }),
    });
  },
  buttonRipple: css({
    padding: 0,
  }).toString(),
  buttonNoRadiusLeft: css({
    ' &&': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  }).toString(),
  buttonNoRadiusRight: css({
    ' &&': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  }).toString(),
  disabled: css({
    ' > div': {
      padding: 0,
    },
  }).toString(),
};

/**
 * A Quantity Picker with unit support.
 * @returns {JSX.Element}
 */
const UnitQuantityPicker = ({
  className,
  onChange,
  value,
  allowDecrement: propsAllowDecrement,
  allowIncrement: propsAllowIncrement,
  allowZero,
  decrementStep,
  incrementStep,
  maxDecimals,
  unit,
  disabled,
  minValue,
  maxValue,
  size,
  toggleTabBarOnFocus,
}) => {
  const allowIncrement = propsAllowIncrement && (maxValue !== null ? value < maxValue : true);
  const allowDecrement = propsAllowDecrement && (value > (minValue ?? 0));

  const widgetDefaults = useMemo(() => {
    if (hasNewServices()) {
      // The widget configuration was introduced with CCP-2449 in PWA6. It's inactive for now
      // when running on new services, since for those shops it never existed and the default
      // values would introduce breaking changes.
      return {

      };
    }

    return {
      buttonColor: colors.shade8,
      buttonBgColor: colors.primary,
      inputColor: colors.dark,
      inputBgColor: colors.shade8,
      showLabel: true,
    };
  }, []);

  const {
    buttonColor = widgetDefaults.buttonColor,
    buttonBgColor = widgetDefaults.buttonBgColor,
    inputColor = widgetDefaults.inputColor,
    inputBgColor = widgetDefaults.inputBgColor,
    // eslint-disable-next-line no-unused-vars
    showLabel = widgetDefaults.showLabel,
  } = useWidgetSettings('@shopgate/engage/product/components/UnitQuantityPicker');

  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef(null);

  const handleOnFocus = useCallback(() => {
    setIsFocused(true);
    if (toggleTabBarOnFocus) {
      UIEvents.emit('HIDE_TAB_BAR');
    }
  }, [toggleTabBarOnFocus]);

  const handleOnBlur = useCallback(() => {
    setIsFocused(false);

    if (toggleTabBarOnFocus) {
      UIEvents.emit('SHOW_TAB_BAR');
    }
  }, [toggleTabBarOnFocus]);

  const handleManualChange = useCallback((newValue) => {
    onChange(newValue);

    let message;

    if (newValue < value) {
      message = 'product.decreased_quantity_to';
    }

    if (newValue > value) {
      message = 'product.increased_quantity_to';
    }

    if (message) {
      broadcastLiveMessage(message, {
        params: {
          quantity: newValue,
        },
      });
    }
  }, [onChange, value]);

  const handleDecrement = useCallback((event) => {
    let newValue = value - decrementStep;
    if ((newValue <= 0 && !allowZero) || (minValue && newValue < minValue)) {
      newValue = value;
    }
    handleManualChange(newValue);
    event.preventDefault();
    event.stopPropagation();
  }, [allowZero, decrementStep, handleManualChange, minValue, value]);

  const handleIncrement = useCallback((event) => {
    let newValue = value + incrementStep;

    if (maxValue && newValue > maxValue) {
      newValue = value;
    }

    handleManualChange(newValue);
    event.preventDefault();
    event.stopPropagation();
  }, [handleManualChange, incrementStep, maxValue, value]);

  useEffect(() => {
    if (minValue && value < minValue) {
      onChange(minValue);
    }

    if (maxValue && value > maxValue) {
      onChange(maxValue);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  /**
   * Handler for pressing "enter" on Android
   */
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && inputRef.current !== null) {
      try {
        inputRef.current.blur();
      } catch (e) {
        // nothing to do here
      }
    }
  }, []);

  return (
    <>
      { isFocused && (
        // Show hidden backdrop when focused to avoid side effects when user blurs the input
        // e.g. opening links unintended
        <div className={styles.backdrop} />
      )}
      <div className={`${styles.root} ${className}`}>
        <RippleButton
          type="secondary"
          disabled={!allowDecrement || disabled}
          rippleClassName={styles.buttonRipple}
          className={classNames(
            styles.button({
              size,
              buttonColor,
              buttonBgColor,
            }),
            styles.buttonNoRadiusRight,
            {
              [styles.disabled]: !allowDecrement || disabled,
            }
          )}
          onClick={handleDecrement}
          aria-label={i18n.text('product.decrease_quantity')}
        >
        -
        </RippleButton>
        <span>
          <QuantityInput
            className={styles.input({
              inputColor,
              inputBgColor,
            })}
            value={value}
            onChange={onChange}
            maxDecimals={maxDecimals}
            unit={unit}
            disabled={disabled}
            minValue={minValue}
            maxValue={maxValue}
            aria-label={i18n.text('product.quantity')}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
        </span>

        <RippleButton
          type="secondary"
          disabled={!allowIncrement || disabled}
          rippleClassName={styles.buttonRipple}
          className={classNames(
            styles.button({
              size,
              buttonColor,
              buttonBgColor,
            }),
            styles.buttonNoRadiusLeft,
            {
              [styles.disabled]: !allowIncrement || disabled,
            }
          )}
          onClick={handleIncrement}
          aria-label={i18n.text('product.increase_quantity')}
        >
        +
        </RippleButton>
      </div>
    </>
  );
};

UnitQuantityPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  allowDecrement: PropTypes.bool,
  allowIncrement: PropTypes.bool,
  allowZero: PropTypes.bool,
  className: PropTypes.string,
  decrementStep: PropTypes.number,
  disabled: PropTypes.bool,
  incrementStep: PropTypes.number,
  maxDecimals: PropTypes.number,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  size: PropTypes.oneOf(['default', 'large']),
  toggleTabBarOnFocus: PropTypes.bool,
  unit: PropTypes.string,
};

UnitQuantityPicker.defaultProps = {
  className: '',
  allowZero: false,
  allowIncrement: true,
  allowDecrement: true,
  incrementStep: 0.25,
  decrementStep: 0.25,
  maxDecimals: 2,
  unit: null,
  disabled: false,
  minValue: null,
  size: 'default',
  maxValue: null,
  toggleTabBarOnFocus: false,
};

export default UnitQuantityPicker;
