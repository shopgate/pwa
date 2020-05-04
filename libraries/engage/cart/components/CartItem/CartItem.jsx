// @flow
import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_ITEM_TYPE_PRODUCT,
  CART_ITEM_TYPE_COUPON,
  CART_ITEM,
} from '@shopgate/pwa-common-commerce/cart';
import CartItemProduct from './CartItemProduct';
import CartItemCoupon from './CartItemCoupon';
import CartItemProductProvider from './CartItemProductProvider';
import { type Item } from '../../cart.types';

type Props = {
  item: Item,
  onFocus: (isEnabled: boolean) => void,
  editable?: boolean,
}

/**
 * The cart item component.
 * @param {Object} props The component props.
 * @property {Object} props.item The cart item.
 * @property {Function} props.onFocus A function to indicate when the item has been focussed.
 * @return {JSX.Element}
 */
function CartItem({ item, onFocus, editable }: Props) {
  if (item.type !== CART_ITEM_TYPE_PRODUCT && item.type !== CART_ITEM_TYPE_COUPON) {
    return null;
  }

  const props = { item };
  const isProduct = (item.type === CART_ITEM_TYPE_PRODUCT);

  if (isProduct) {
    return (
      <SurroundPortals portalName={CART_ITEM} portalProps={props}>
        <CartItemProductProvider cartItem={item} onFocus={onFocus} isEditable={editable}>
          <CartItemProduct />
        </CartItemProductProvider>
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
        editable={editable}
      />
    </SurroundPortals>
  );
}

CartItem.defaultProps = {
  editable: true,
};

export default hot(React.memo<Props>(CartItem));
