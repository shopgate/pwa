import React, { PropTypes } from 'react';
import {
  COUPON_TYPE_FIXED,
  COUPON_TYPE_PERCENTAGE,
} from 'Library/constants/Cart';
import { Price } from 'Templates/components';
import styles from '../style';

/**
 * The CouponPrice component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const CouponPrice = (props) => {
  const {
    type: discountType,
    value: discountValue,
  } = props.savedPrice;

  if (discountType === COUPON_TYPE_FIXED) {
    return (
      <Price
        className={styles.savedPrice}
        currency={props.currency}
        unitPrice={-discountValue}
        discounted
      />
    );
  } else if (discountType === COUPON_TYPE_PERCENTAGE) {
    return (
      <span className={styles.savedPrice}>
        -{discountValue}%
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
