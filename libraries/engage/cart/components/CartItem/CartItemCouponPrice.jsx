// @flow
import * as React from 'react';
import {
  COUPON_TYPE_FIXED,
  COUPON_TYPE_PERCENTAGE,
} from '@shopgate/pwa-common-commerce/cart';
import Price from '@shopgate/pwa-ui-shared/Price';
import styles from './CartItemCouponPrice.style';
import { type SavedPrice } from '../../cart.types';

type Props = {
  currency: string,
  savedPrice: SavedPrice,
}

/**
 * The Coupon Price component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
export const CartItemCouponPrice = React.memo<Props>(({ currency, savedPrice }: Props) => {
  if (savedPrice.type === COUPON_TYPE_FIXED) {
    return (
      <Price
        className={styles}
        currency={currency}
        discounted
        unitPrice={-savedPrice.value}
      />
    );
  }

  if (savedPrice.type === COUPON_TYPE_PERCENTAGE) {
    return (
      <span className={styles}>
        {`-${savedPrice.value}%`}
      </span>
    );
  }

  return null;
});
