import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { themeConfig } from '@shopgate/engage';
import { RippleButton, QuantityInput, I18n } from '@shopgate/engage/components';
import { useWidgetSettings, withCurrentProduct } from '@shopgate/engage/core';
import { connect } from 'react-redux';
import { getProductPropertiesUnfiltered } from '@shopgate/pwa-common-commerce/product/selectors/product';

const { variables, colors } = themeConfig;

// default dimension to be used for button and input
// in order for them to look with the same size
const defaultDimension = 36;

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
    height: defaultDimension,
    width: '100%',
    minWidth: '32px',
    backgroundColor: bgColor,
    color,
  }).toString(),
  inputWrapper: css({
    width: '100%',
  }),
  button: (color, bgColor) => css({
    backgroundColor: `${bgColor} !important`,
    color: `${color} !important`,
    width: defaultDimension,
    ' &&': {
      minWidth: defaultDimension,
      padding: 0,
    },
    height: defaultDimension,
  }).toString(),
  buttonRipple: css({
    padding: 0,
    // we use this calculation in order to make the font size
    // relative to the default dimension. number 28 was the
    // one we used before and it looked "normal" on desktop
    fontSize: `${Math.floor((defaultDimension / 28) * 100)}%`,
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
  quantityLabelWrapper: bgColor => css({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: bgColor,
  }).toString(),
  quantityLabel: color => css({
    fontSize: '12px',
    padding: '0 1em',
    color,
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
  productProperties,
}) => {
  const {
    buttonColor = colors.shade8,
    buttonBgColor = colors.primary,
    inputColor = colors.dark,
    inputBgColor = colors.shade8,
    propertyLabel = '',
  } = useWidgetSettings('@shopgate/engage/product/components/UnitQuantityPicker') || {};

  const property = productProperties.filter(({ label: l }) => l === propertyLabel)[0];

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
      <span className={styles.quantityLabelWrapper(inputBgColor)}>
        <div aria-hidden className={styles.quantityLabel(inputColor)}>
          {
            property && property.value && property.value !== ''
              ? property.value
              : <I18n.Text string="product.sections.quantity" />
          }
        </div>

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
        className={
          classNames(
            styles.button(buttonColor, buttonBgColor),
            styles.buttonNoRadiusLeft, {
              [styles.disabled]: disabled,
            }
          )}
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
  productProperties: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
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
  productProperties: [],
};

/**
 * maps the state to props
 * @param {Object} state state object
 * @param {Object} props property object
 * @return {{productProperties: unknown}}
 */
const mapStateToProps = (state, props) => ({
  productProperties: getProductPropertiesUnfiltered(state, props),
});

export default withCurrentProduct(connect(mapStateToProps)(UnitQuantityPicker));
