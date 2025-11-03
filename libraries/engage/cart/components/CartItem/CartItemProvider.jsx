import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Context from './CartItemProvider.context';
import connect from './CartItemProvider.connector';
/* eslint-disable max-len */
/**
 * The CartItem Provider
 * @param {Object} props The component props.
 * @param {Object} props.cartItem The cart item data.
 * @param {boolean} [props.isEditable=true] Whether the cart item is editable.
 * @param {boolean} [props.isOrderDetails=false] Whether the component is used in order details.
 * @param {boolean} [props.cartIsDirectShipOnly=false] Whether the cart is direct ship only.
 * @param {boolean} [props.isCheckoutConfirmation=false] Whether the component is used in checkout confirmation.
 * @param {boolean} [props.cartHasLineItemPromotions=false] Whether the cart has line item promotions.
 * @param {Object|null} [props.location=null] The location data.
 * @param {React.ReactNode} [props.children=null] Child components.
 * @param {number} props.enabledFulfillmentMethodsCount The count of enabled fulfillment methods.
 * @returns {JSX.Element} The rendered component.
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
}) => {
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

CartItemProvider.propTypes = {
  cartItem: PropTypes.shape().isRequired,
  enabledFulfillmentMethodsCount: PropTypes.number.isRequired,
  cartHasLineItemPromotions: PropTypes.bool,
  cartIsDirectShipOnly: PropTypes.bool,
  children: PropTypes.node,
  isCheckoutConfirmation: PropTypes.bool,
  isEditable: PropTypes.bool,
  isOrderDetails: PropTypes.bool,
  location: PropTypes.shape(),
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
/* eslint-enable max-len */
