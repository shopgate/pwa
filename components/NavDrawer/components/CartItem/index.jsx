import React from 'react';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import Item from '../Item';

/**
 * The Cart Item component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItem = (props) => {
  // Stop the cart count from displaying more than 99.
  let count = Math.min(props.count, CART_MAX_ITEMS) || null;

  if (props.count > 99) {
    count = `${count}+`;
  }

  return (
    <Item {...props} count={count} testId="navDrawerCartButton" />
  );
};

CartItem.propTypes = Item.propTypes;

CartItem.defaultProps = Item.defaultProps;

export default CartItem;
