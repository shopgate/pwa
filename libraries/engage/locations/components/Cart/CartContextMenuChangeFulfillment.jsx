import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FulfillmentProvider } from '../../providers';
import { FulfillmentSheetContent } from '../FulfillmentSheet/FulfillmentSheetContent';
import CartContextMenuChangeFulfillmentContent from './CartContextMenuChangeFulfillmentContent';
/**
 * @typedef {import('../../../cart/cart.types').Item} Item
 */

/**
 * @typedef {Object} Props
 * @property {Item} cartItem
 */

/**
 * The CartContextMenuChangeFulfillment component renders a context menu which enables
 * switching the active fulfillment method for a cart item.
 * @param {Props} props The component props.
 * @returns {JSX.Element}
 */
const CartContextMenuChangeFulfillment = ({ cartItem }) => {
  const contextProps = useMemo(() => ({
    productId: cartItem.product.id,
    meta: { cartItem },
    updatePreferredLocation: true,
  }), [cartItem]);

  return (
    <FulfillmentProvider {...contextProps}>
      <CartContextMenuChangeFulfillmentContent />
      <FulfillmentSheetContent />
    </FulfillmentProvider>
  );
};

CartContextMenuChangeFulfillment.propTypes = {
  cartItem: PropTypes.shape({
    product: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default CartContextMenuChangeFulfillment;
