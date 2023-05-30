import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/engage';
import { RippleButton, QuantityInput } from '@shopgate/engage/components';

const { variables, colors } = themeConfig;

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    zIndex: 1000,
  }).toString(),
  backdrop: css({
    zIndex: 999,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    position: 'fixed',
  }),
  input: css({
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
    flex: 1,
    fontSize: 15,
    height: 28,
    width: '100%',
    backgroundColor: `var(--color-background-accent, ${colors.shade8})`,
  }).toString(),
  inputWrapper: css({
    width: '100%',
  }),
  button: css({
    width: 28,
    ' &&': {
      minWidth: 28,
      padding: 0,
    },
    height: 28,
  }).toString(),
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
  allowDecrement,
  allowIncrement,
  allowZero,
  decrementStep,
  incrementStep,
  maxDecimals,
  unit,
  disabled,
  minValue,
  maxValue,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleOnFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleOnBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleDecrement = useCallback((event) => {
    let newValue = value - decrementStep;
    if ((newValue <= 0 && !allowZero) || (minValue && newValue < minValue)) {
      newValue = value;
    }
    onChange(newValue);
    event.preventDefault();
    event.stopPropagation();
  }, [allowZero, decrementStep, minValue, onChange, value]);

  const handleIncrement = useCallback((event) => {
    let newValue = value + incrementStep;

    if (maxValue && newValue > maxValue) {
      newValue = value;
    }

    onChange(newValue);
    event.preventDefault();
    event.stopPropagation();
  }, [incrementStep, maxValue, onChange, value]);

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

  return (
    <>
      { isFocused && (
        // Show hidden backdrop when focused to avoid side effects when user blurs the input
        // e.g. opening links unintended
        <div className={styles.backdrop} />
      )}
      <div className={`${styles.root} ${className}`}>
        <RippleButton
          rippleClassName={styles.buttonRipple}
          className={classNames(styles.button, styles.buttonNoRadiusRight, {
            [styles.disabled]: disabled,
          })}
          type="secondary"
          disabled={!allowDecrement || disabled}
          onClick={handleDecrement}
          aria-label={i18n.text('product.decrease_quantity')}
        >
        -
        </RippleButton>
        <span>
          <QuantityInput
            className={styles.input}
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
          />
        </span>

        <RippleButton
          type="secondary"
          disabled={!allowIncrement || disabled}
          rippleClassName={styles.buttonRipple}
          className={classNames(styles.button, styles.buttonNoRadiusLeft, {
            [styles.disabled]: disabled,
          })}
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
  maxValue: null,
};

export default UnitQuantityPicker;
