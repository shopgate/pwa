import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Substitution from '../Substitution';
import connect from './CartItemsSubscription.connector';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemsSubstitution = ({ cartItems, updateProductsInCart, className }) => {
  const allAllowed = useMemo(() => cartItems.every(item => item.substitutionAllowed), [cartItems]);
  return (
    <Substitution
      className={className}
      id="substitution-all"
      checked={allAllowed}
      onChange={() => updateProductsInCart(cartItems.map(item => ({
        cartItemId: item.id,
        substitutionAllowed: !allAllowed,
      })))}
    />
  );
};

CartItemsSubstitution.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.shape).isRequired,
  updateProductsInCart: PropTypes.func.isRequired,
  className: PropTypes.string,
};

CartItemsSubstitution.defaultProps = {
  className: undefined,
};

export default connect(CartItemsSubstitution);
