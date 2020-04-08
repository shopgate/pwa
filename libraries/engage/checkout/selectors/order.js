import { createSelector } from 'reselect';
import { convertLineItemsToCartItems } from '../helpers';

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
    return [
      {
        visible: true,
        type: 'subTotal',
        value: order.subTotal,
        currencyCode: order.currencyCode,
      },
      {
        visible: order.taxAmount > 0,
        type: 'tax',
        value: order.taxAmount,
        currencyCode: order.currencyCode,
      },
      {
        visible: true,
        type: 'total',
        value: order.total,
        currencyCode: order.currencyCode,
      },
    ];
  }
);
