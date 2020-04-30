import React, { useContext } from 'react';
import { AppContext } from '@shopgate/engage/core';
import { I18n } from '@shopgate/engage/components';
import { CartContext } from '../../cart.context';
import { FLAG_MULTI_LINE_RESERVE } from '../../cart.constants';
import { hint } from './CartSummaryWideFooter.style';

/**
 * @returns {JSX}
 */
const CartSummaryWideFooter = () => {
  const { flags } = useContext(CartContext);
  const { appConfig: { shopName } } = useContext(AppContext);

  if (!flags[FLAG_MULTI_LINE_RESERVE]) {
    return null;
  }

  return (
    <I18n.Text
      className={hint}
      string="cart.reservation_hint"
      params={{ shopName }}
    />
  );
};

export default CartSummaryWideFooter;
