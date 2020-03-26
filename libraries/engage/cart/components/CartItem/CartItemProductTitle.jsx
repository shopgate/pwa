// @flow
import * as React from 'react';
import {
  Grid, I18n, SurroundPortals, ContextMenu,
} from '@shopgate/engage/components';
import { CART_ITEM_NAME } from '@shopgate/pwa-common-commerce/cart';
import {
  CartContextMenuItemChangeLocation,
  CartContextMenuItemChangeFulfillment,
} from '@shopgate/engage/locations';
import { type Item } from '../../cart.types';
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
  handleRemove?: () => void,
  toggleEditMode?: (editMode: boolean) => void,
}

type ContextProps = {
  cartItem?: Item,
  invokeAction: (action: string) => void,
  cartItemId?: string,
  type?: string,
}

/**
 * The Cart Product Title component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
export function CartItemProductTitle(props: Props, context: ContextProps) {
  const { value, handleRemove, toggleEditMode } = props;
  const { invokeAction } = context;

  const handleToggleEditMode = React.useCallback(() => {
    if (toggleEditMode) {
      toggleEditMode(true);
    }
  }, [toggleEditMode]);

  const handleChangeLocationClick = React.useCallback(() => {
    invokeAction('changeLocation');
  }, [invokeAction]);

  const handleChangeFulfillmentClick = React.useCallback(() => {
    invokeAction('changeFulfillment');
  }, [invokeAction]);

  return (
    <Grid>
      <Grid.Item grow={1}>
        <SurroundPortals portalName={CART_ITEM_NAME} portalProps={context}>
          <div className={title} data-test-id={value}>
            {value}
          </div>
        </SurroundPortals>
      </Grid.Item>
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
    </Grid>
  );
}

CartItemProductTitle.defaultProps = {
  handleRemove: () => { },
  toggleEditMode: () => { },
};
