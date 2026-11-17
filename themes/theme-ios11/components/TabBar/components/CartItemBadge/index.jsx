import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CART_MAX_ITEMS } from 'Pages/Cart/constants';
import TabBarBadge from '../TabBarBadge';

/**
 * The cart item badge component.
 * Shows the amount of products in the cart.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const CartItemBadge = props => (
  <TabBarBadge
    count={props.cartProductCount}
    max={CART_MAX_ITEMS}
    className="theme__tab-bar__cart-item-badge"
  />
);

CartItemBadge.propTypes = {
  cartProductCount: PropTypes.number.isRequired,
};

export default memo(CartItemBadge);
