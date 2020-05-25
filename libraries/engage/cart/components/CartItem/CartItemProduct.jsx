// @flow
import React, { Fragment } from 'react';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { MessageBar, ResponsiveContainer } from '@shopgate/engage/components';
import { getPageSettings } from '@shopgate/engage/core/config';
import {
  messagesContainerCard,
  messagesCard,
  messagesContainerLine,
  messagesLine,
} from './CartItem.style';
import { CartItemProductLayout } from './CartItemProductLayout';
import { CartItemProductLayoutWide } from './CartItemProductLayoutWide';
import { noGap } from './CartItemProduct.style';
import { useCartItemProduct } from './CartItem.hooks';

const messageStyles = {
  card: {
    container: messagesContainerCard,
    message: messagesCard,
  },
  line: {
    container: messagesContainerLine,
    message: messagesLine,
  },
};

/**
 * The CartProduct component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemProduct = () => {
  const { messages, cartItemRef } = useCartItemProduct();
  const { cartItemsDisplay = 'line' } = getPageSettings(CART_PATH);

  return (
    <CardListItem className={cartItemsDisplay === 'card' ? noGap : null}>
      <div ref={cartItemRef} data-test-id="cartItem">
        <ResponsiveContainer appAlways breakpoint="<=xs">
          <Fragment>
            {messages.length > 0 && (
              <MessageBar messages={messages} classNames={messageStyles[cartItemsDisplay]} />
            )}
            <CartItemProductLayout />
          </Fragment>
        </ResponsiveContainer>
        <ResponsiveContainer webOnly breakpoint=">xs">
          <CartItemProductLayoutWide />
        </ResponsiveContainer>
      </div>
    </CardListItem>
  );
};

export default CartItemProduct;
