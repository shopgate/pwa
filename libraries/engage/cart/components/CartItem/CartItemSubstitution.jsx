import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import connect from './CartItemSubscription.connector';
import { useCartItem } from './CartItem.hooks';
import Substitution, { SubstitutionWrapper } from '../Substitution';
import { root } from './CartItemSubstitution.style';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemSubstitution = ({ setSubstitutionAllowed, editable }) => {
  const { cartItem: { id, substitutionAllowed } } = useCartItem();
  return (
    <SubstitutionWrapper>
      <Substitution
        className={root}
        id={`substitution-${id}`}
        label={i18n.text('cart.allow_substitution')}
        checked={substitutionAllowed}
        onChange={() => setSubstitutionAllowed(id, !substitutionAllowed)}
        disabled={!editable}
      />
    </SubstitutionWrapper>
  );
};

CartItemSubstitution.propTypes = {
  setSubstitutionAllowed: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

CartItemSubstitution.defaultProps = {
  editable: false,
};

export default connect(CartItemSubstitution);
