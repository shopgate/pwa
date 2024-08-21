import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import styles from './CartItemCouponTitle.style';

/**
 * The CouponTitle component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
export function CartItemCouponTitle({ value }) {
  const title = useMemo(() => (
    value || i18n.text('cart.default_coupon_label')
  ), [value]);

  return (
    <div className={styles}>
      {title}
    </div>
  );
}

CartItemCouponTitle.propTypes = {
  value: PropTypes.string,
};

CartItemCouponTitle.defaultProps = {
  value: null,
};
