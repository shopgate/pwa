import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import UnitQuantityPicker from './UnitQuantityPicker';
import { small, big } from './styles';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartUnitQuantityPicker = ({
  unit, value, onChange, classNames, hasCatchWeight,
}) => {
  const hasUnitWithDecimals = (unit && hasCatchWeight) || false;

  const {
    withDecimals,
    withoutDecimals,
  } = classNames;

  return (
    <UnitQuantityPicker
      className={!hasUnitWithDecimals ? withDecimals : withoutDecimals}
      unit={hasUnitWithDecimals ? unit : null}
      maxDecimals={hasUnitWithDecimals ? 2 : 0}
      incrementStep={hasUnitWithDecimals ? 0.25 : 1}
      decrementStep={hasUnitWithDecimals ? 0.25 : 1}
      onChange={onChange}
      value={value}
    />
  );
};

CartUnitQuantityPicker.propTypes = {
  value: PropTypes.number.isRequired,
  classNames: PropTypes.shape({
    withDecimals: PropTypes.string,
    withoutDecimals: PropTypes.string,
  }),
  hasCatchWeight: PropTypes.bool,
  onChange: PropTypes.func,
  unit: PropTypes.string,
};

CartUnitQuantityPicker.defaultProps = {
  unit: null,
  onChange: noop,
  classNames: {
    withDecimals: big,
    withoutDecimals: small,
  },
  hasCatchWeight: false,
};

export default CartUnitQuantityPicker;
