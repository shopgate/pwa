import React, { useContext } from 'react';
import { CartContext } from '../../cart.context';
import { FLAG_MULTI_LINE_RESERVE } from '../../cart.constants';
import { SupplementalContent } from '../SupplementalContent';

/**
 * @returns {JSX}
 */
const CartSummaryWideFooter = () => {
  const { flags } = useContext(CartContext);

  if (!flags[FLAG_MULTI_LINE_RESERVE]) {
    return null;
  }

  return (
    <SupplementalContent />
  );
};

export default CartSummaryWideFooter;
