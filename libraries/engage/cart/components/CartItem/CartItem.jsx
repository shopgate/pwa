// @flow
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_ITEM_TYPE_PRODUCT,
  CART_ITEM_TYPE_COUPON,
  CART_ITEM,
} from '@shopgate/pwa-common-commerce/cart';
import CartItemProduct from './CartItemProduct';
import CartItemCoupon from './CartItemCoupon';
import { type Item } from '../../cart.types';

type Props = {
  item: Item,
  onFocus: (isEnabled: boolean) => void,
}

/**
 * The cart item component.
 * @param {Object} props The component props.
 * @property {Object} props.item The cart item.
 * @property {Function} props.onFocus A function to indicate when the item has been focussed.
 * @return {JSX.Element}
 */
export const CartItem = React.memo<Props>(({ item, onFocus }: Props) => {
  if (item.type !== CART_ITEM_TYPE_PRODUCT && item.type !== CART_ITEM_TYPE_COUPON) {
    return null;
  }

  const props = { item };
  const isProduct = (item.type === CART_ITEM_TYPE_PRODUCT);

  if (isProduct) {
    return (
      <SurroundPortals portalName={CART_ITEM} portalProps={props}>
        <CartItemProduct
          key={item.id}
          id={item.id}
          product={item.product}
          quantity={item.quantity}
          messages={item.messages}
          fulfillment={item.fulfillment}
          onToggleFocus={onFocus}
        />
      </SurroundPortals>
    );
  }

  return (
    <SurroundPortals portalName={CART_ITEM} portalProps={props}>
      <CartItemCoupon
        id={item.id}
        key={item.id}
        coupon={item.coupon}
        messages={item.messages}
      />
    </SurroundPortals>
  );
});
