import React, { useMemo, useCallback } from 'react';
import Context from './CartItemProvider.context';

type Props = {
  cartItem: Object,
  children?: React.Node
}

/**
 * The CartItem Provider
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const CartItemProvider = ({ cartItem, children }: Props) => {
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
  }), [cartItem, invokeFulfillmentAction, registerFulfillmentAction]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

CartItemProvider.defaultProps = {
  children: null,
};

export default CartItemProvider;
