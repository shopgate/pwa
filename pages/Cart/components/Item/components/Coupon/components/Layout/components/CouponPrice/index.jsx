import React from 'react';
import PropTypes from 'prop-types';
import {
  COUPON_TYPE_FIXED,
  COUPON_TYPE_PERCENTAGE,
} from '@shopgate/pwa-common-commerce/cart/constants';
import Price from '@shopgate/pwa-ui-shared/Price';
import styles from './style';

/**
 * The Coupon Price component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const CouponPrice = ({ currency, savedPrice }) => {
  const {
    type: discountType,
    value: discountValue,
  } = savedPrice;

  if (discountType === COUPON_TYPE_FIXED) {
    return (
      <Price
        className={styles}
        currency={currency}
        discounted
        unitPrice={-discountValue}
      />
    );
  }

  if (discountType === COUPON_TYPE_PERCENTAGE) {
    return (
      <span className={styles}>
        -
        {discountValue}
%
      </span>
    );
  }

  return null;
};

CouponPrice.propTypes = {
  currency: PropTypes.string.isRequired,
  savedPrice: PropTypes.shape({
    type: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
};

export default CouponPrice;
