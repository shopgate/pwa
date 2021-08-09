import React from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import connect from './connector';
import style from './style';

/**
 * The cart item badge component.
 * Shows the amount of products in the cart.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemBadge = (props) => {
  if (!props.cartProductCount) {
    return null;
  }

  let cartProductCount = `${props.cartProductCount}`;

  if (props.cartProductCount > CART_MAX_ITEMS) {
    cartProductCount = `${CART_MAX_ITEMS}+`;
  }

  return (
    <div className={`${style} tabbar-cart-badge`}>{cartProductCount}</div>
  );
};

CartItemBadge.propTypes = {
  cartProductCount: PropTypes.number.isRequired,
};

export default connect(CartItemBadge);
