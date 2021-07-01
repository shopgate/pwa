import React from 'react';
import { themeConfig } from '@shopgate/engage';
import { useWidgetSettings } from '@shopgate/engage/core';
import { Icon, CartCouponIcon } from '@shopgate/engage/components';

/**
 * Coupon icon component
 * @returns {*}
 * @constructor
 */
const CouponIcon = () => {
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

export default CouponIcon;
