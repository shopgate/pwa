import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/engage';
import { RippleButton, QuantityInput } from '@shopgate/engage/components';
import { useWidgetSettings } from '@shopgate/engage/core';

const { variables, colors } = themeConfig;

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'row',
  }).toString(),
  input: (color, bgColor) => css({
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
    flex: 1,
    fontSize: 15,
    height: 28,
    width: '100%',
    backgroundColor: bgColor || colors.shade8,
    color,
  }).toString(),
  inputWrapper: css({
    width: '100%',
  }),
  button: (color, bgColor) => css({
    backgroundColor: bgColor,
    color,
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
 * @returns {JSX}
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
  const {
    buttonColor = colors.primary,
    buttonBgColor = colors.primary,
    inputColor = null,
    inputBgColor = null,
  } = useWidgetSettings('@shopgate/engage/product/components/UnitQuantityPicker') || {};
  const handleDecrement = useCallback(() => {
    let newValue = value - decrementStep;
    if ((newValue <= 0 && !allowZero) || (minValue && newValue < minValue)) {
      newValue = value;
    }
    onChange(newValue);
  }, [allowZero, decrementStep, minValue, onChange, value]);

  const handleIncrement = useCallback(() => {
    let newValue = value + incrementStep;

    if (maxValue && newValue > maxValue) {
      newValue = value;
    }

    onChange(newValue);
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
    <div className={`${styles.root} ${className}`}>
      <RippleButton
        rippleClassName={styles.buttonRipple}
        className={
          classNames(
            styles.button(buttonColor, buttonBgColor),
            styles.buttonNoRadiusRight, {
              [styles.disabled]: disabled,
            }
          )}
        type="secondary"
        disabled={!allowDecrement || disabled}
        onClick={handleDecrement}
      >
        -
      </RippleButton>
      <span>
        <QuantityInput
          className={styles.input(inputColor, inputBgColor)}
          value={value}
          onChange={onChange}
          maxDecimals={maxDecimals}
          unit={unit}
          disabled={disabled}
          minValue={minValue}
          maxValue={maxValue}
        />
      </span>

      <RippleButton
        type="secondary"
        disabled={!allowIncrement || disabled}
        rippleClassName={styles.buttonRipple}
        className={classNames(styles.button(buttonColor), styles.buttonNoRadiusLeft, {
          [styles.disabled]: disabled,
        })}
        onClick={handleIncrement}
      >
        +
      </RippleButton>
    </div>
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
