import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CardList, Toggle, I18n } from '@shopgate/engage/components';
import {
  root, checkbox, space, text,
} from './CartItemsSubstitution.style';
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
      <div className={space} />
      <I18n.Text
        string="cart.allow_substitution_all"
        className={text}
      />
      <div className={space}>
        <Toggle
          className={checkbox}
          checked={allAllowed}
          id="substitution-all"
          onChange={() => updateProductsInCart(cartItems.map(item => ({
            cartItemId: item.id,
            substitutionAllowed: !allAllowed,
          })))}
        />
      </div>
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
