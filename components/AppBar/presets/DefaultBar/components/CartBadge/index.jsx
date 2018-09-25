import React from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import styles from './style';

/**
 * @param {number} props.count The number of products in the cart.
 * @returns {JSX}
 */
function CartButtonBadge({ count }) {
  let productCount = count;

  if (count > CART_MAX_ITEMS) {
    productCount = `${CART_MAX_ITEMS}+`;
  }

  return (
    <div className={styles}>{productCount}</div>
  );
}

CartButtonBadge.propTypes = {
  count: PropTypes.number.isRequired,
};

export default CartButtonBadge;
