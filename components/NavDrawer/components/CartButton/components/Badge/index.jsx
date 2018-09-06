import React from 'react';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import consume from './consumer';
import styles from './style';

/**
 * @param {number} props.count The number of product in the cart.
 * @returns {JSX}
 */
const CartButtonBadge = ({ count }) => (
  (count > 0) && (
    <span className={styles}>
      {Math.min(count, CART_MAX_ITEMS)}
      {count > 99 && '+'}
    </span>
  )
);

export default consume(CartButtonBadge);
