import React, { useMemo } from 'react';
import { hot } from 'react-hot-loader/root';
import { FulfillmentProvider } from '../../providers';
import { FulfillmentSheetContent } from '../FulfillmentSheet/FulfillmentSheetContent';
import CartContextMenuChangeFulfillmentContent from './CartContextMenuChangeFulfillmentContent';
import { type Item } from '../../../cart';

type Props = {
  cartItem: Item,
}

/**
 * The CartContextMenuChangeFulfillmentContent component renders a context menu which enables
 * switching the active fulfillment method for a cart item.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartContextMenuChangeFulfillment = ({ cartItem }: Props) => {
  const contextProps = useMemo(() => ({
    productId: cartItem.product.id,
    meta: { cartItem },
  }), [cartItem]);

  return (
    <FulfillmentProvider {...contextProps}>
      <CartContextMenuChangeFulfillmentContent />
      <FulfillmentSheetContent />
    </FulfillmentProvider>
  );
};

export default hot(CartContextMenuChangeFulfillment);
