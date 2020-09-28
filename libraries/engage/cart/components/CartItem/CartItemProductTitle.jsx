// @flow
import React, { useCallback } from 'react';
import {
  Grid, I18n, ContextMenu,
} from '@shopgate/engage/components';
import { CART_ITEM_NAME } from '@shopgate/pwa-common-commerce/cart';
import {
  CartContextMenuItemChangeLocation,
  CartContextMenuItemChangeFulfillment,
} from '@shopgate/engage/locations';
import { ProductName } from '@shopgate/engage/product';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';
import {
  menuToggleButton,
  menuToggleContainer,
  title,
  menuContainer,
} from './CartItemProductTitle.style';

const contextMenuClasses = {
  button: menuToggleButton,
  container: menuToggleContainer,
};

type Props = {
  value: string,
}

/**
 * The Cart Product Title component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
export function CartItemProductTitle(props: Props) {
  const { value } = props;
  const { invokeFulfillmentAction } = useCartItem();

  const context = useCartItemProduct();
  const {
    handleRemove, toggleEditMode, cartItem, isEditable,
  } = context;

  const handleToggleEditMode = useCallback(() => {
    if (toggleEditMode) {
      toggleEditMode(true);
    }
  }, [toggleEditMode]);

  const handleChangeLocationClick = useCallback(() => {
    if (!cartItem || !cartItem.fulfillment || !cartItem.fulfillment.method) {
      return;
    }

    const { fulfillment: { method } } = cartItem;

    invokeFulfillmentAction('changeLocation', method);
  }, [cartItem, invokeFulfillmentAction]);

  const handleChangeFulfillmentClick = useCallback(() => {
    invokeFulfillmentAction('changeFulfillment');
  }, [invokeFulfillmentAction]);

  return (
    <Grid>
      <Grid.Item grow={1}>
        <ProductName
          name={value}
          className={title}
          portalName={CART_ITEM_NAME}
          portalProps={context}
          testId={value}
          ellipsis={false}
        />
      </Grid.Item>
      { isEditable && (
        <Grid.Item className={menuContainer} shrink={0}>
          <ContextMenu classes={contextMenuClasses}>
            <ContextMenu.Item onClick={handleRemove}>
              <I18n.Text string="cart.remove" />
            </ContextMenu.Item>
            <ContextMenu.Item onClick={handleToggleEditMode}>
              <I18n.Text string="cart.edit" />
            </ContextMenu.Item>
            <CartContextMenuItemChangeLocation
              cartItem={context.cartItem}
              onClick={handleChangeLocationClick}
            />
            <CartContextMenuItemChangeFulfillment
              cartItem={context.cartItem}
              onClick={handleChangeFulfillmentClick}
            />
          </ContextMenu>
        </Grid.Item>
      )}

    </Grid>
  );
}
