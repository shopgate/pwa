import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core';
import { CardList } from '@shopgate/engage/components';
import Substitution, { SubstitutionWrapper } from '../Substitution';
import connect from './CartItemsSubscription.connector';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemsSubstitution = ({
  cartItems, updateProductsInCart, className, wrapped,
}) => {
  const allAllowed = useMemo(() => cartItems.every(item => item.substitutionAllowed), [cartItems]);
  const handleChange = useCallback(() => updateProductsInCart(cartItems.map(item => ({
    cartItemId: item.id,
    substitutionAllowed: !allAllowed,
  }))), [allAllowed, cartItems, updateProductsInCart]);
  if (wrapped) {
    return (
      <SubstitutionWrapper>
        <CardList.Item className={className}>
          <Substitution
            id="substitution-all"
            label={i18n.text('cart.allow_substitution_all')}
            checked={allAllowed}
            onChange={handleChange}
          />
        </CardList.Item>
      </SubstitutionWrapper>
    );
  }
  return (
    <SubstitutionWrapper>
      <Substitution
        className={className}
        id="substitution-all"
        label={i18n.text('cart.allow_substitution_all')}
        checked={allAllowed}
        onChange={handleChange}
      />
    </SubstitutionWrapper>
  );
};

CartItemsSubstitution.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.shape).isRequired,
  updateProductsInCart: PropTypes.func.isRequired,
  className: PropTypes.string,
  wrapped: PropTypes.bool,
};

CartItemsSubstitution.defaultProps = {
  className: undefined,
  wrapped: false,
};

export default connect(CartItemsSubstitution);
