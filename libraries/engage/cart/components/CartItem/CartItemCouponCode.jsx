// @flow
import React from 'react';
import { i18n } from '@shopgate/engage/core';

type Props = {
  value: string,
}

/**
* The Coupon Code component.
* @param {Object} props The component props.
* @returns {JSX}
*/
export const CartItemCouponCode = ({ value }: Props) => (
  <div>
    {`${i18n.text('cart.coupon_code')}: ${value}`}
  </div>
);
