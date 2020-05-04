import React, { useCallback, useMemo } from 'react';
import {
  I18n, ContextMenu,
} from '@shopgate/engage/components';
import {
  DIRECT_SHIP,
  ROPIS,
  BOPIS,
} from '../../constants';
import {
  menuToggleButton,
  menuToggleContainer,
} from './CartContextMenuChangeFulfillmentContent.style';
import { useFulfillmentState } from '../../locations.hooks';

const contextMenuClasses = {
  button: menuToggleButton,
  container: menuToggleContainer,
};

/**
 * The CartContextMenuChangeFulfillmentContent component renders a context menu which enables
 * switching the active fulfillment method for a cart item.
 * @returns {JSX}
 */
const CartContextMenuChangeFulfillmentContent = () => {
  const labelMapping = {
    [DIRECT_SHIP]: 'cart.change_fulfillment.direct_ship',
    [ROPIS]: 'cart.change_fulfillment.ropis',
    [BOPIS]: 'cart.change_fulfillment.bopis',
  };

  const {
    fulfillmentMethods,
    enabledFulfillmentMethods,
    meta: { cartItem },
    changeFulfillment,
  } = useFulfillmentState();

  const activeFulfillmentMethod = useMemo(
    () => cartItem.fulfillment?.method || DIRECT_SHIP,
    [cartItem.fulfillment]
  );

  const handleChangeFulfillment = useCallback((method) => {
    changeFulfillment(method, cartItem);
  }, [cartItem, changeFulfillment]);

  const selectableFulfillmentMethods = useMemo(() => {
    if (!enabledFulfillmentMethods || !fulfillmentMethods) {
      return [];
    }

    return fulfillmentMethods.filter(
      method =>
        enabledFulfillmentMethods.includes(method) &&
        method !== activeFulfillmentMethod
    );
  }, [activeFulfillmentMethod, enabledFulfillmentMethods, fulfillmentMethods]);

  const disabled = selectableFulfillmentMethods.length === 0;

  return (
    <ContextMenu classes={contextMenuClasses} disabled={disabled}>
      { selectableFulfillmentMethods.map(method => (
        <ContextMenu.Item key={method} onClick={() => handleChangeFulfillment(method)}>
          <I18n.Text string={labelMapping[method]} />
        </ContextMenu.Item>
      ))}
    </ContextMenu>
  );
};

export default CartContextMenuChangeFulfillmentContent;
