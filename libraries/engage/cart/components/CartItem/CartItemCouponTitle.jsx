// @flow
import * as React from 'react';
import { i18n } from '@shopgate/engage/core';
import styles from './CartItemCouponTitle.style';

type Props = {
  value?: string,
}

/**
 * The CouponTitle component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
export function CartItemCouponTitle({ value }: Props) {
  const title = React.useMemo<string>(() => (
    value || i18n.text('cart.default_coupon_label')
  ), [value]);

  return (
    <div className={styles}>
      {title}
    </div>
  );
}

CartItemCouponTitle.defaultProps = {
  value: null,
};
