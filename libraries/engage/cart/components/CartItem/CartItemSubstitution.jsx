import React from 'react';
import PropTypes from 'prop-types';
import { Toggle, I18n } from '@shopgate/engage/components';
import {
  root, checkbox, space, text,
} from './CartItemSubstitution.style';
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
      <div className={space} />
      <I18n.Text
        string="cart.allow_substitution"
        className={text}
      />
      <div className={space}>
        <Toggle
          className={checkbox}
          id={`substitution-${id}`}
          checked={substitutionAllowed}
          onChange={() => setSubstitutionAllowed(id, !substitutionAllowed)}
        />
      </div>
    </div>
  );
};

CartItemCardSubstitution.propTypes = {
  setSubstitutionAllowed: PropTypes.bool.isRequired,
};

export default connect(CartItemCardSubstitution);
