import * as React from 'react';
import PropTypes from 'prop-types';
import {
  COUPON_TYPE_FIXED,
  COUPON_TYPE_PERCENTAGE,
} from '@shopgate/pwa-common-commerce/cart';
import Price from '@shopgate/pwa-ui-shared/Price';
import styles from './CartItemCouponPrice.style';

/**
 * The Coupon Price component.
 * @param {Object} props The component properties.
 * @param {string} props.currency The currency to display.
 * @param {Object} props.savedPrice The saved price details.
 * @param {string} props.savedPrice.type The type of the saved price (fixed or percentage).
 * @param {number} props.savedPrice.value The value of the saved price.
 * @returns {JSX.Element|null}
 */
export const CartItemCouponPrice = React.memo(({ currency, savedPrice }) => {
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

CartItemCouponPrice.propTypes = {
  currency: PropTypes.string.isRequired,
  savedPrice: PropTypes.shape({
    type: PropTypes.oneOf([COUPON_TYPE_FIXED, COUPON_TYPE_PERCENTAGE]).isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
};
