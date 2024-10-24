import React from 'react';
import { themeConfig } from '@shopgate/engage';
import { useWidgetSettings } from '@shopgate/engage/core/hooks';
import { Icon, CartCouponIcon } from '@shopgate/engage/components';

/**
 * Renders the cart item coupon icon.
 * @returns {JSX}
 */
export const CartItemCouponIcon = () => {
  const { viewBox, color } = useWidgetSettings('@shopgate/engage/components/CartCouponIcon');

  if (!themeConfig.icons.cartCoupon) {
    return <CartCouponIcon />;
  }

  return (
    <Icon
      {...viewBox && { viewBox }}
      content={themeConfig.icons.cartCoupon}
      color={color}
    />
  );
};

