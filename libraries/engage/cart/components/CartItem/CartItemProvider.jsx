import React, { useMemo, useCallback } from 'react';
import Context from './CartItemProvider.context';

type Props = {
  cartItem: Object,
  isEditable?: boolean,
  children?: React.Node
}

/**
 * The CartItem Provider
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemProvider = ({ cartItem, isEditable, children }: Props) => {
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
    isEditable,
  }), [cartItem, invokeFulfillmentAction, isEditable, registerFulfillmentAction]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

CartItemProvider.defaultProps = {
  children: null,
  isEditable: true,
};

export default CartItemProvider;
