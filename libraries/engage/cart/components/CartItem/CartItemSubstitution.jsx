import React from 'react';
import PropTypes from 'prop-types';
import connect from './CartItemSubscription.connector';
import { useCartItem } from './CartItem.hooks';
import Substitution from '../Substitution';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemSubstitution = ({ setSubstitutionAllowed }) => {
  const { cartItem: { id, substitutionAllowed } } = useCartItem();
  return (
    <Substitution
      checked={substitutionAllowed}
      onChange={() => setSubstitutionAllowed(id, !substitutionAllowed)}
    />
  );
};

CartItemSubstitution.propTypes = {
  setSubstitutionAllowed: PropTypes.bool.isRequired,
};

export default connect(CartItemSubstitution);
