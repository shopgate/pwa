import {
  REQUEST_ORDER_HISTORY,
  RECEIVE_ORDER_HISTORY,
  ERROR_ORDER_HISTORY,
} from '../constants';

/**
 * Creates the dispatched REQUEST_ORDER_HISTORY action object.
 * @returns {Object} The dispatched action object.
 * @param {Object} [params={}] Optional params like limit and offset
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
