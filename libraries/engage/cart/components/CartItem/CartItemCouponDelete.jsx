import React from 'react';
import PropTypes from 'prop-types';
import { CrossIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import styles from './CartItemCouponDelete.style';
/**
 * The Coupon Delete component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
export const CartItemCouponDelete = ({ handleDelete }) => (
  <button
    className={styles}
    onClick={handleDelete}
    data-test-id="deleteCoupon"
    type="button"
    aria-label={i18n.text('cart.delete_coupon')}
  >
    <CrossIcon />
  </button>
);

CartItemCouponDelete.propTypes = {
  handleDelete: PropTypes.func,
};

CartItemCouponDelete.defaultProps = {
  handleDelete: () => { },
};
