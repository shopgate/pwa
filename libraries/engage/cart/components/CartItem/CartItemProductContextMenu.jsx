import React, { useCallback } from 'react';
import PT from 'prop-types';
import {
  Grid, I18n, ContextMenu,
} from '@shopgate/engage/components';
import {
  CartContextMenuItemChangeLocation,
  CartContextMenuItemChangeFulfillment,
} from '@shopgate/engage/locations';
import {
  menuToggleButton,
  menuToggleContainer,
  menuContainer,
} from './CartItemProductContextMenu.style';

const contextMenuClasses = {
  button: menuToggleButton,
  container: menuToggleContainer,
};

type Props = {
  handleRemove?: () => void,
  toggleEditMode?: (editMode: boolean) => void,
  showEdit?: boolean,
  showRemove?: boolean,
}

type ContextProps = {
  cartItem?: Item,
  invokeAction: (action: string, method?: string) => void,
  cartItemId?: string,
  type?: string,
  editable?: boolean
}

/**
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const CartItemProductContextMenu = (props: Props, context: ContextProps) => {
  const {
    handleRemove, toggleEditMode, showEdit, showRemove,
  } = props;
  const { invokeAction, cartItem } = context;

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

    invokeAction('changeLocation', method);
  }, [cartItem, invokeAction]);

  const handleChangeFulfillmentClick = useCallback(() => {
    invokeAction('changeFulfillment');
  }, [invokeAction]);

  return (
    <Grid.Item className={menuContainer} shrink={0}>
      <ContextMenu classes={contextMenuClasses}>
        {showEdit && (
          <ContextMenu.Item onClick={handleRemove}>
            <I18n.Text string="cart.remove" />
          </ContextMenu.Item>
        )}
        {showRemove && (
          <ContextMenu.Item onClick={handleToggleEditMode}>
            <I18n.Text string="cart.edit" />
          </ContextMenu.Item>
        )}
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
  );
};

CartItemProductContextMenu.defaultProps = {
  handleRemove: () => { },
  toggleEditMode: () => { },
  showEdit: true,
  showRemove: true,
};

CartItemProductContextMenu.contextTypes = {
  cartItem: PT.shape(),
  invokeAction: PT.func,
  cartItemId: PT.string,
  type: PT.string,
  editable: PT.bool,
};

export { CartItemProductContextMenu };
