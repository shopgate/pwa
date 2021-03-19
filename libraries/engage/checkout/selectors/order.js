import { createSelector } from 'reselect';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { DIRECT_SHIP, ROPIS, BOPIS } from '@shopgate/engage/locations';
import {
  convertLineItemsToCartItems,
  getCheckoutTaxLinesFromOrder,
  isReserveOnlyOrder,
} from '../helpers';

/**
 * Returns the current order created in the checkout process.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutOrder = state => state.checkout.checkoutOrder.data || null;

/**
 * Returns the checkout totals
 * @param {Object} state The application state.
 * @return {number}
 */
export const getCheckoutOrderTotal = state => getCheckoutOrder(state)?.total;

/**
 * Returns the current attached customer of the active order.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutOrderCustomer =
  state => state.checkout.checkoutOrder?.data?.customer || null;

/**
 * Returns the current orders payment transaction created in the checkout process.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutPaymentTransactions = state =>
  getCheckoutOrder(state)?.paymentTransactions || [];

export const getCheckoutFulfillmentSlot = createSelector(
  getCheckoutOrder,
  order => order?.lineItems?.[0]?.fulfillmentSlot || null
);

/**
 * Returns the billing address of the order.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutBillingAddress = createSelector(
  getCheckoutOrder,
  (order) => {
    if (!order) return null;

    const addresses = order.addressSequences || [];
    return addresses.find(({ type }) => type === 'billing');
  }
);

/**
 * Returns the shipping address of the order.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutShippingAddress = createSelector(
  getCheckoutOrder,
  (order) => {
    if (!order) return null;

    const addresses = order.addressSequences || [];
    return addresses.find(({ type }) => type === 'shipping');
  }
);

/**
 * Returns the pickup address of the order.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutPickupAddress = createSelector(
  getCheckoutOrder,
  (order) => {
    if (!order) return null;

    const addresses = order.addressSequences || [];
    return addresses.find(({ type }) => type === 'pickup');
  }
);

/**
 * Returns whether the billing and pickup address are the same.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const isPickupAndBillingEquals = createSelector(
  getCheckoutBillingAddress,
  getCheckoutPickupAddress,
  (billing, pickup) => {
    if (!billing || !pickup) return true;

    if (billing.mobile !== pickup.mobile) return false;
    if (billing.emailAddress !== pickup.emailAddress) return false;
    if (billing.firstName !== pickup.firstName) return false;
    if (billing.lastName !== pickup.lastName) return false;

    return true;
  }
);

/**
 * Returns whether the billing and shipping address are the same.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const isShippingBillingEquals = createSelector(
  getCheckoutBillingAddress,
  getCheckoutShippingAddress,
  (billing, shipping) => {
    if (!billing || !shipping) return true;

    const positiveList = ['index', 'type', 'customerContactId'];

    return Object.keys(billing).every((key) => {
      if (positiveList.includes(key)) return true;
      return billing[key] === shipping[key];
    });
  }
);

/**
 * Returns the number of the order.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutOrderNumber = createSelector(
  getCheckoutOrder,
  (order) => {
    if (!order) {
      return null;
    }

    return order.orderNumber;
  }
);

/**
 * Returns the line items of the order.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutOrderLineItems = createSelector(
  getCheckoutOrder,
  (order) => {
    if (!order) {
      return null;
    }

    return order.lineItems;
  }
);

/**
 * Returns the line items of the order converted to the data structure of cart items
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutOrderLineItemsAsCartItems = createSelector(
  getCheckoutOrderLineItems,
  (lineItems) => {
    if (!lineItems) {
      return null;
    }

    return convertLineItemsToCartItems(lineItems);
  }
);

/**
 * Returns whether the active order is a pure reservation.
 */
export const getIsReserveOnly = createSelector(
  getCheckoutOrder,
  (order) => {
    if (!order) return null;

    return isReserveOnlyOrder(order);
  }
);

/**
 * Returns whether the current order just consists out of directShip items
 */
export const getIsDirectShipOnly = createSelector(
  getCheckoutOrderLineItems,
  (lineItems) => {
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return false;
    }

    return lineItems.every(({ fulfillmentMethod }) => fulfillmentMethod === DIRECT_SHIP);
  }
);

export const getHasDirectShipItems = createSelector(
  getCheckoutOrderLineItems,
  (lineItems) => {
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return false;
    }

    return lineItems.some(({ fulfillmentMethod }) => fulfillmentMethod === DIRECT_SHIP);
  }
);

export const getHasROPEItems = createSelector(
  getCheckoutOrderLineItems,
  (lineItems) => {
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return false;
    }

    return lineItems.some(({ fulfillmentMethod }) => [ROPIS, BOPIS].includes(fulfillmentMethod));
  }
);

/**
 * Returns whether the shipping address selection is enabled
 */
export const getIsShippingAddressSelectionEnabled = createSelector(
  getHasDirectShipItems,
  isUserLoggedIn,
  hasDirectShipItems => hasDirectShipItems
);

export const getIsPickupContactSelectionEnabled = getHasROPEItems;

/**
 * Returns a list of tax lines for the order summary.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutTaxLines = createSelector(
  getCheckoutOrder,
  getHasDirectShipItems,
  (order, hasDirectShipItems) => {
    if (!order) return [];
    return getCheckoutTaxLinesFromOrder(order, hasDirectShipItems);
  }
);
