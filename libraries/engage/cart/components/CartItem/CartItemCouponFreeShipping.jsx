// @flow
import React from 'react';
import { i18n } from '@shopgate/engage/core';

type Props = {
  freeShipping?: boolean
}

/**
 * The Coupon Free Shipping component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function CartItemCouponFreeShipping({ freeShipping }: Props) {
  if (!freeShipping) {
    return null;
  }

  return (
    <div>
      {i18n.text('cart.free_shipping')}
    </div>
  );
}

CartItemCouponFreeShipping.defaultProps = {
  freeShipping: false,
};
