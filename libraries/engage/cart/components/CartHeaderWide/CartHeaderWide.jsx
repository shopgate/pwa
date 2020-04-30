import React from 'react';
import { i18n } from '@shopgate/engage/core';
import { header } from './CartHeaderWide.style';

/**
 * @return {JSX}
 */
const CartHeaderWide = () => (
  <div className={header}>
    { i18n.text('navigation.cart') }
  </div>
);

export default CartHeaderWide;
