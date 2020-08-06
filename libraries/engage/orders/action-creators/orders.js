import {
  CLEAR_ORDERS,
  ERROR_CANCEL_ORDER,
  REQUEST_ORDER_HISTORY,
  RECEIVE_ORDER_HISTORY,
  ERROR_ORDER_HISTORY,
} from '../constants';

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
 * @param {string} params An order id
 * @returns {Object} The dispatched action object.
 */
export const errorCancelOrder = (error, params) => ({
  type: ERROR_CANCEL_ORDER,
  error,
  ...params,
});

/**
 * Creates the dispatched REQUEST_ORDER_HISTORY action object.
 * @returns {Object} The dispatched action object.
 */
export const requestOrderHistory = () => ({
  type: REQUEST_ORDER_HISTORY,
});

/**
 * Creates the dispatched RECEIVE_ORDER_HISTORY action object.
 * @param {Array} orders Order list
 * @param {number} totalOrderCount Total number of orders
 * @returns {Object} The dispatched action object.
 */
export const receiveOrderHistory = (orders, totalOrderCount) => ({
  type: RECEIVE_ORDER_HISTORY,
  totalOrderCount,
  orders,
});

/**
 * Creates the dispatched ERROR_ORDER_HISTORY action object.
 * @param {Error} error An error object
 * @returns {Object} The dispatched action object.
 */
export const errorOrderHistory = error => ({
  type: ERROR_ORDER_HISTORY,
  error,
});
