import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  CART_ITEM_TYPE_PRODUCT,
  CART_ITEM_TYPE_COUPON,
} from '@shopgate/pwa-common-commerce/cart/constants';
import {
  CART_ITEM,
  CART_ITEM_BEFORE,
  CART_ITEM_AFTER,
} from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import Product from './components/Product';
import Coupon from './components/Coupon';

/**
 * The CartItem component.
 * @param {Object} props The component props.
 * @param {Object} props.item The cart item.
 * @param {Function} props.onFocus A function to indicate when the item has been focussed.
 * @return {JSX}
 */
const CartItem = ({ item, onFocus }) => {
  if (item.type !== CART_ITEM_TYPE_PRODUCT && item.type !== CART_ITEM_TYPE_COUPON) {
    return null;
  }

  const props = { item };
  const isProduct = (item.type === CART_ITEM_TYPE_PRODUCT);

  return (
    <Fragment>
      <Portal name={CART_ITEM_BEFORE} props={props} />
      <Portal name={CART_ITEM} props={props}>
        {isProduct ? (
          <Product
            id={item.id}
            key={item.id}
            product={item.product}
            quantity={item.quantity}
            messages={item.messages}
            onToggleFocus={onFocus}
          />
        ) : (
          <Coupon
            id={item.id}
            key={item.id}
            coupon={item.coupon}
            messages={item.messages}
          />
        )}
      </Portal>
      <Portal name={CART_ITEM_AFTER} props={props} />
    </Fragment>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape().isRequired,
  onFocus: PropTypes.func.isRequired,
};

export default CartItem;
