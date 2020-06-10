import {
  REQUEST_ORDER_DETAILS,
  RECEIVE_ORDER_DETAILS,
  ERROR_ORDER_DETAILS,
} from '../constants';

/**
 * Creates the dispatched REQUEST_ORDER_DETAILS action object.
 * @param {string} orderId An order id
 * @param {Object} [params={}] Optional params like email and phone number
 * @returns {Object} The dispatched action object.
 */
export const requestOrderDetails = (orderId, params) => ({
  type: REQUEST_ORDER_DETAILS,
  orderId,
  params,
});

/**
 * Creates the dispatched RECEIVE_ORDER_DETAILS action object.
 * @param {string} orderId An order id
 * @param {Object} order An order object
 * @returns {Object} The dispatched action object.
 */
export const receiveOrderDetails = (orderId, order) => ({
  type: RECEIVE_ORDER_DETAILS,
  orderId,
  order,
});

/**
 * Creates the dispatched ERROR_ORDER_DETAILS action object.
 * @param {Error} error An error object
 * @param {string} orderId An order id
 * @param {Object} [params={}] Optional params like email and phone number
 * @returns {Object} The dispatched action object.
 */
export const errorOrderDetails = (error, orderId, params = {}) => ({
  type: ERROR_ORDER_DETAILS,
  error,
  orderId,
  params,
});
