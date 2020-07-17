import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@shopgate/pwa-ui-shared/Form/Checkbox';
import { root, checkbox } from './CartItemSubstitution.style';
import connect from './CartItemSubscription.connector';
import { useCartItem } from './CartItem.hooks';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemCardSubstitution = ({ setSubstitutionAllowed }) => {
  const { cartItem: { id, substitutionAllowed } } = useCartItem();
  return (
    <div className={root}>
      <Checkbox
        className={checkbox}
        checked={substitutionAllowed}
        label="Allow Substitutions?"
        onChange={() => setSubstitutionAllowed(id, !substitutionAllowed)}
      />
    </div>
  );
};

CartItemCardSubstitution.propTypes = {
  setSubstitutionAllowed: PropTypes.bool.isRequired,
};

export default connect(CartItemCardSubstitution);
