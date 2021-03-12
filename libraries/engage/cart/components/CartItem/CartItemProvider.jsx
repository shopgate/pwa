import React, { useMemo, useCallback } from 'react';
import Context from './CartItemProvider.context';
import connect from './CartItemProvider.connector';

type Props = {
  cartItem: Object,
  isEditable?: boolean,
  isOrderDetails?:boolean,
  cartIsDirectShipOnly?:boolean,
  isCheckoutConfirmation?:boolean,
  cartHasLineItemPromotions?:boolean,
  location?: Object | null,
  children?: React.Node,
  enabledFulfillmentMethodsCount: number,
}

/**
 * The CartItem Provider
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemProvider = ({
  cartItem,
  location,
  isEditable,
  children,
  enabledFulfillmentMethodsCount,
  isOrderDetails,
  isCheckoutConfirmation,
  cartIsDirectShipOnly,
  cartHasLineItemPromotions,
}: Props) => {
  const actions = useMemo(() => new Map(), []);

  const registerFulfillmentAction = useCallback((action, callback) => {
    actions.set(action, callback);
  }, [actions]);

  const invokeFulfillmentAction = useCallback((action, ...args) => {
    if (!actions.has(action)) {
      return;
    }

    actions.get(action)(...args);
  }, [actions]);

  const value = useMemo(() => ({
    registerFulfillmentAction,
    invokeFulfillmentAction,
    cartItem,
    location,
    isEditable,
    isOrderDetails,
    isCheckoutConfirmation,
    cartIsDirectShipOnly,
    cartHasLineItemPromotions,
    merchantFulfillmentMethodsCount: enabledFulfillmentMethodsCount,
  }), [
    cartItem,
    location,
    enabledFulfillmentMethodsCount,
    invokeFulfillmentAction,
    isEditable,
    isOrderDetails,
    isCheckoutConfirmation,
    cartIsDirectShipOnly,
    cartHasLineItemPromotions,
    registerFulfillmentAction,
  ]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

CartItemProvider.defaultProps = {
  children: null,
  location: null,
  isEditable: true,
  isOrderDetails: false,
  cartIsDirectShipOnly: false,
  isCheckoutConfirmation: false,
  cartHasLineItemPromotions: false,
};

export default connect(CartItemProvider);
