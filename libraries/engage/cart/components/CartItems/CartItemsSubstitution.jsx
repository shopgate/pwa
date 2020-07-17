import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from '@shopgate/pwa-ui-shared/Form/Checkbox';
import { CardList } from '@shopgate/engage/components';
import { root, checkbox } from './CartItemsSubstitution.style';
import connect from './CartItemsSubscription.connector';

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemsSubstitution = ({ className, cartItems, updateProductsInCart }) => {
  const allAllowed = useMemo(() => cartItems.every(item => item.substitutionAllowed), [cartItems]);
  return (
    <CardList.Item className={classNames(root, className)}>
      <Checkbox
        className={checkbox}
        checked={allAllowed}
        label="Allow Substitutions on All Products?"
        onChange={() => updateProductsInCart(cartItems.map(item => ({
          cartItemId: item.id,
          substitutionAllowed: !allAllowed,
        })))}
      />
    </CardList.Item>
  );
};

CartItemsSubstitution.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.shape).isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]).isRequired,
  updateProductsInCart: PropTypes.func.isRequired,
};

CartItemsSubstitution.defaultProps = {
};

export default connect(CartItemsSubstitution);
