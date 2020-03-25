// @flow
import React from 'react';
import { CrossIcon } from '@shopgate/engage/components';
import { i18n } from '@shopgate/engage/core';
import styles from './CartItemCouponDelete.style';

type Props = {
  handleDelete?: (event: SyntheticEvent<HTMLButtonElement>) => void,
}

/**
 * The Coupon Delete component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
export const CartItemCouponDelete = ({ handleDelete }: Props) => (
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

CartItemCouponDelete.defaultProps = {
  handleDelete: () => { },
};
