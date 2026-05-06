import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import {
  COUPON_TYPE_FIXED,
  COUPON_TYPE_PERCENTAGE,
} from '@shopgate/pwa-common-commerce/cart';
import Price from '@shopgate/pwa-ui-shared/Price';

const useStyles = makeStyles()({
  price: {
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--color-primary)',
  },
});
/**
 * @typedef {import('../../cart.types').SavedPrice} SavedPrice
 */

/**
 * The Coupon Price component.
 * @param {Object} props The component properties.
 * @param {string} props.currency The currency to display.
 * @param {SavedPrice} props.savedPrice The saved price details.
 * @param {string} props.savedPrice.type The type of the saved price (fixed or percentage).
 * @param {number} props.savedPrice.value The value of the saved price.
 * @returns {JSX.Element|null}
 */
export const CartItemCouponPrice = React.memo(({ currency, savedPrice }) => {
  const { classes } = useStyles();
  if (savedPrice.type === COUPON_TYPE_FIXED) {
    return (
      <Price
        className={classes.price}
        currency={currency}
        discounted
        unitPrice={-savedPrice.value}
      />
    );
  }

  if (savedPrice.type === COUPON_TYPE_PERCENTAGE) {
    return (
      <span className={classes.price}>
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
