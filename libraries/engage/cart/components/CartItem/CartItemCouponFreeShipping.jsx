import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';

/**
 * The Coupon Free Shipping component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export function CartItemCouponFreeShipping({ freeShipping }) {
  if (!freeShipping) {
    return null;
  }

  return (
    <div>
      {i18n.text('cart.free_shipping')}
    </div>
  );
}

CartItemCouponFreeShipping.propTypes = {
  freeShipping: PropTypes.bool,
};

CartItemCouponFreeShipping.defaultProps = {
  freeShipping: false,
};
