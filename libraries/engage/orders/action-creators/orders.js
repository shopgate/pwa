import { CLEAR_ORDERS, ERROR_CANCEL_ORDER } from '../constants';

/**
 * Creates the dispatched CLEAR_ORDERS action object.
 * @returns {Object} The dispatched action object.
 */
export const clearOrders = () => ({
  type: CLEAR_ORDERS,
});

/**
 * Creates the dispatched ERROR_CANCEL_ORDER action object.
 * @param {Error} error An error object
 * @param {string} orderId An order id
 * @returns {Object} The dispatched action object.
 */
export const errorCancelOrder = (error, orderId) => ({
  type: ERROR_CANCEL_ORDER,
  error,
  orderId,
});
