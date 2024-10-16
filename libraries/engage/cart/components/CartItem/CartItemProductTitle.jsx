import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, ContextMenu, SurroundPortals,
} from '@shopgate/engage/components';
import {
  CART_ITEM_CONTEXT_MENU,
  CART_ITEM_CONTEXT_MENU_ITEM_EDIT,
  CART_ITEM_CONTEXT_MENU_ITEM_REMOVE,
  CART_ITEM_NAME,
} from '@shopgate/engage/cart';
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

/**
 * The Cart Product Title component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
export function CartItemProductTitle({ value }) {
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
          <SurroundPortals
            portalName={CART_ITEM_CONTEXT_MENU}
            portalProps={{
              context,
              handleRemove,
              toggleEditMode,
            }}
          >
            <ContextMenu classes={contextMenuClasses}>
              <SurroundPortals
                portalName={CART_ITEM_CONTEXT_MENU_ITEM_REMOVE}
                portalProps={{
                  context,
                  handleRemove,
                }}
              >
                <div data-test-id="cartItemContextMenuItemRemove">
                  <ContextMenu.Item onClick={handleRemove}>
                    <I18n.Text string="cart.remove" />
                  </ContextMenu.Item>
                </div>
              </SurroundPortals>
              <SurroundPortals
                portalName={CART_ITEM_CONTEXT_MENU_ITEM_EDIT}
                portalProps={{
                  context,
                  toggleEditMode,
                }}
              >
                <div data-test-id="cartItemContextMenuItemEdit">
                  <ContextMenu.Item onClick={handleToggleEditMode}>
                    <I18n.Text string="cart.edit" />
                  </ContextMenu.Item>
                </div>
              </SurroundPortals>
              <CartContextMenuItemChangeLocation
                cartItem={context.cartItem}
                onClick={handleChangeLocationClick}
              />
              <CartContextMenuItemChangeFulfillment
                cartItem={context.cartItem}
                onClick={handleChangeFulfillmentClick}
              />
            </ContextMenu>
          </SurroundPortals>
        </Grid.Item>
      )}
    </Grid>
  );
}

CartItemProductTitle.propTypes = {
  value: PropTypes.string.isRequired,
};
