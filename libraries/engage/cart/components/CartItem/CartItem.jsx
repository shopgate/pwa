import React from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import {
  CART_ITEM_TYPE_PRODUCT,
  CART_ITEM_TYPE_COUPON,
  CART_ITEM,
} from '@shopgate/pwa-common-commerce/cart';
import { ProductListEntryProvider } from '@shopgate/engage/product';
import CartItemProduct from './CartItemProduct';
import CartItemCoupon from './CartItemCoupon';
import CartItemProductProvider from './CartItemProductProvider';

/**
 * The cart item component.
 * @param {Object} props The component props.
 * @property {Object} props.item The cart item.
 * @property {Function} props.onFocus A function to indicate when the item has been focussed.
 * @property {boolean} [props.editable] Whether the item is editable.
 * @property {string|null} [props.currencyOverride] The currency to use instead of the default one.
 * @return {JSX.Element}
 */
function CartItem({
  item, onFocus, editable, currencyOverride,
}) {
  if (item.type !== CART_ITEM_TYPE_PRODUCT && item.type !== CART_ITEM_TYPE_COUPON) {
    return null;
  }

  const props = { item };
  const isProduct = (item.type === CART_ITEM_TYPE_PRODUCT);

  if (isProduct) {
    return (
      <ProductListEntryProvider productId={item?.product?.id}>
        <SurroundPortals portalName={CART_ITEM} portalProps={props}>
          <CartItemProductProvider
            cartItem={item}
            onFocus={onFocus}
            isEditable={editable}
            currencyOverride={currencyOverride}
          >
            <CartItemProduct />
          </CartItemProductProvider>
        </SurroundPortals>
      </ProductListEntryProvider>
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
  currencyOverride: null,
};

CartItem.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.string.isRequired,
    id: PropTypes.string,
    product: PropTypes.shape(),
    coupon: PropTypes.shape(),
    messages: PropTypes.arrayOf(PropTypes.shape({
      message: PropTypes.string,
      type: PropTypes.string,
    })),
  }).isRequired,
  onFocus: PropTypes.func.isRequired,
  currencyOverride: PropTypes.string,
  editable: PropTypes.bool,
};

export default React.memo(CartItem);
