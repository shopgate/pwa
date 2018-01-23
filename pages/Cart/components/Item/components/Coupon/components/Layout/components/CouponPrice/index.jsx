/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  COUPON_TYPE_FIXED,
  COUPON_TYPE_PERCENTAGE,
} from '@shopgate/pwa-common-commerce/cart/constants';
import Price from 'Components/Price';
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
      <Price className={styles} currency={currency} unitPrice={-discountValue} discounted />
    );
  } else if (discountType === COUPON_TYPE_PERCENTAGE) {
    return (
      <span className={styles}>
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
