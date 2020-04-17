import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/engage';
import { RippleButton, QuantityInput } from '@shopgate/engage/components';

const { variables, colors } = themeConfig;

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'row',
  }).toString(),
  input: css({
    padding: `0 ${variables.gap.small}px`,
    textAlign: 'center',
    flex: 1,
    fontSize: 15,
    height: 28,
    width: '100%',
    backgroundColor: colors.shade8,
  }).toString(),
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
}) => {
  const handleDecrement = useCallback(() => {
    let newValue = value - decrementStep;
    if (newValue <= 0 && !allowZero) {
      newValue = value;
    }
    onChange(newValue);
  }, [allowZero, decrementStep, onChange, value]);

  const handleIncrement = useCallback(() => {
    const newValue = value + incrementStep;
    onChange(newValue);
  }, [incrementStep, onChange, value]);

  return (
    <div className={`${styles.root} ${className}`}>
      <RippleButton
        rippleClassName={styles.buttonRipple}
        className={`${styles.button} ${styles.buttonNoRadiusRight}`}
        type="secondary"
        disabled={!allowDecrement}
        onClick={handleDecrement}
      >
        -
      </RippleButton>
      <QuantityInput
        className={styles.input}
        value={value}
        onChange={onChange}
        maxDecimals={maxDecimals}
        unit={unit}
      />
      <RippleButton
        type="secondary"
        disabled={!allowIncrement}
        rippleClassName={styles.buttonRipple}
        className={`${styles.button} ${styles.buttonNoRadiusLeft}`}
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
  incrementStep: PropTypes.number,
  maxDecimals: PropTypes.number,
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
};

export default UnitQuantityPicker;
