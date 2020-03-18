// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { CardList } from '@shopgate/engage/components';
import { type CartItem } from '../../cart.types';
import { CartItemCard } from './CartItemCard';
import { items, card } from './CartItems.style';

type Props = {
  cartItems: CartItem[],
  children: (item: CartItem) => React.Element<any>,
  multiLineReservation?: boolean,
}

/**
 * Renders the cart items.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
function CartItems({ cartItems, children, multiLineReservation }: Props) {
  return (
    <CardList className={items}>
      {cartItems.map(item => (
        <CardList.Item className={card} key={item.id}>
          <CartItemCard
            multiLineReservation={multiLineReservation}
            fulfillmentLocationId={item.fulfillmentLocationId}
          >
            {children(item)}
          </CartItemCard>
        </CardList.Item>
      ))}
    </CardList>
  );
}

CartItems.defaultProps = {
  multiLineReservation: null,
};

export default hot(CartItems);
