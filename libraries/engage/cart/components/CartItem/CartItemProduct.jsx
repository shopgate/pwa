import React from 'react';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import CardListItem from '@shopgate/pwa-ui-shared/CardList/components/Item';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { MessageBar, ResponsiveContainer } from '@shopgate/engage/components';
import { getPageSettings } from '@shopgate/engage/core/config';
import { CartItemProductLayout } from './CartItemProductLayout';
import { CartItemProductLayoutWide } from './CartItemProductLayoutWide';
import { useCartItemProduct } from './CartItem.hooks';
import CartItemSubstitution from './CartItemSubstitution';

const { colors, variables } = themeConfig;

const useStyles = makeStyles()({
  noGap: {
    marginBottom: 0,
    background: 'none',
  },
  messagesContainerCard: {
    background: colors.light,
    padding: `0 0 ${variables.gap.big}px 0`,
  },
  messagesCard: {
    borderRadius: '5px 5px 0 0',
    padding: `${variables.gap.small}px ${variables.gap.big * 0.875}px`,
  },
  messagesContainerLine: {
    background: colors.light,
    padding: `${variables.gap.big}px ${variables.gap.big}px 0`,
  },
  messagesLine: {
    borderRadius: 4,
    padding: `${variables.gap.big / 2}px ${variables.gap.big}px`,
    lineHeight: 1.125,
  },
});

/**
 * The CartProduct component.
 * @returns {JSX}
 */
const CartItemProduct = () => {
  const { classes } = useStyles();
  const { messages, cartItemRef, isEditable } = useCartItemProduct();
  const { cartItemsDisplay = 'line' } = getPageSettings(CART_PATH);
  const messageStyles = {
    card: {
      container: classes.messagesContainerCard,
      message: classes.messagesCard,
    },
    line: {
      container: classes.messagesContainerLine,
      message: classes.messagesLine,
    },
  };

  return (
    <CardListItem className={cartItemsDisplay === 'card' ? classes.noGap : null}>
      <div ref={cartItemRef} data-test-id="cartItem">
        <ResponsiveContainer appAlways breakpoint="<=xs">
          <>
            {messages.length > 0 && (
              <MessageBar messages={messages} classNames={messageStyles[cartItemsDisplay]} />
            )}
            <CartItemProductLayout />
          </>
        </ResponsiveContainer>
        <ResponsiveContainer webOnly breakpoint=">xs">
          <CartItemProductLayoutWide />
        </ResponsiveContainer>
        <CartItemSubstitution editable={isEditable} />
      </div>
    </CardListItem>
  );
};

export default CartItemProduct;
