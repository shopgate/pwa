import { createSelector } from 'reselect';
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
 * Returns the current orders payment transaction created in the checkout process.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutPaymentTransactions = state =>
  getCheckoutOrder(state)?.paymentTransactions || [];

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
    return addresses[order.primaryBillToAddressSequenceIndex];
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
    return addresses[order.primaryShipToAddressSequenceIndex];
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
 * Returns a list of tax lines for the order summary.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCheckoutTaxLines = createSelector(
  getCheckoutOrder,
  (order) => {
    if (!order) return [];
    return getCheckoutTaxLinesFromOrder(order);
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
