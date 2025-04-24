import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, ContextMenu, SurroundPortals, TextLink,
} from '@shopgate/engage/components';
import {
  CART_ITEM_CONTEXT_MENU,
  CART_ITEM_CONTEXT_MENU_ITEM_REMOVE,
  CART_ITEM_NAME,
} from '@shopgate/engage/cart';
import {
  CartContextMenuItemChangeLocation,
  CartContextMenuItemChangeFulfillment,
} from '@shopgate/engage/locations';
import { ITEM_PATH, ProductName } from '@shopgate/engage/product';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { useCartItem, useCartItemProduct } from './CartItem.hooks';
import {
  menuToggleButton,
  menuToggleContainer,
  title,
  menuContainer,
} from './CartItemProductTitle.style';
import { ConditionalWrapper } from '../../../components';

const contextMenuClasses = {
  button: menuToggleButton,
  container: menuToggleContainer,
};

/**
 * The Cart Product Title component.
 * @param {Object} props The component properties.
 * @param {string} props.value The product name
 * @param {string} props.productId The product id
 * @returns {JSX.Element}
 */
export function CartItemProductTitle({ value, productId }) {
  const { invokeFulfillmentAction } = useCartItem();

  const context = useCartItemProduct();
  const {
    handleRemove, toggleEditMode, cartItem, isEditable,
  } = context;

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
        <ConditionalWrapper
          condition={isEditable}
          wrapper={children =>
            <TextLink href={`${ITEM_PATH}/${bin2hex(productId)}`}>
              {children}
            </TextLink>
          }
        >
          <ProductName
            name={value}
            className={title}
            portalName={CART_ITEM_NAME}
            portalProps={context}
            testId={value}
            ellipsis={false}
          />
        </ConditionalWrapper>
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
  productId: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
