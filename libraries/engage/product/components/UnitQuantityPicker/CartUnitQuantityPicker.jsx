import React from 'react';
import { PRODUCT_UNIT_EACH } from '../../constants';
import UnitQuantityPicker from './UnitQuantityPicker';
import { small, big } from './styles';

type Props = {
  unit: string,
  value: number,
  onChange: () => any,
  classNames?: {
    withDecimals: string,
    withoutDecimals: string,
  }
}

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartUnitQuantityPicker = ({
  unit, value, onChange, classNames,
}: Props) => {
  const hasUnitWithDecimals = unit && unit !== PRODUCT_UNIT_EACH;

  const {
    withDecimals,
    withoutDecimals,
  } = classNames;

  return (
    <UnitQuantityPicker
      className={hasUnitWithDecimals ? withDecimals : withoutDecimals}
      unit={hasUnitWithDecimals ? unit : null}
      maxDecimals={hasUnitWithDecimals ? 2 : 0}
      incrementStep={hasUnitWithDecimals ? 0.25 : 1}
      decrementStep={hasUnitWithDecimals ? 0.25 : 1}
      onChange={onChange}
      value={value}
    />
  );
};

CartUnitQuantityPicker.defaultProps = {
  classNames: {
    withDecimals: big,
    withoutDecimals: small,
  },
};

export default CartUnitQuantityPicker;
