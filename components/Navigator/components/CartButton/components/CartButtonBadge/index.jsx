import React from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from 'Library/constants/DisplayOptions';

/**
 * The cart button badge component.
 * Shows the amount of products in the cart.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartButtonBadge = (props) => {
  let productCount = `${props.productCount}`;

  if (props.productCount > CART_MAX_ITEMS) {
    productCount = `${CART_MAX_ITEMS}+`;
  }

  return (
    <div className={props.className}>{productCount}</div>
  );
};

CartButtonBadge.propTypes = {
  productCount: PropTypes.number.isRequired,
  className: PropTypes.string,
};

CartButtonBadge.defaultProps = {
  className: '',
};

export default CartButtonBadge;
