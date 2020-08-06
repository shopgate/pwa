import {
  REQUEST_ORDER_DETAILS,
  RECEIVE_ORDER_DETAILS,
  ERROR_ORDER_DETAILS,
} from '../constants';

/**
 * @typedef {Object} OrderDetailParams
 * @property {number} [params.orderId] Order Id
 * @property {string} [params.orderNumber] Order Number
 * @property {string} [params.email] Email
 * @property {string} [params.phone] Phone Number
 * @property {string} [params.token] Request params
 */

/**
 * Creates the dispatched REQUEST_ORDER_DETAILS action object.
 * @param {OrderDetailParams} params Request params
 * @returns {Object} The dispatched action object.
 */
export const requestOrderDetails = params => ({
  type: REQUEST_ORDER_DETAILS,
  ...params,
});

/**
 * Creates the dispatched RECEIVE_ORDER_DETAILS action object.
 * @param {OrderDetailParams} params Request params
 * @param {Object} order An order object
 * @returns {Object} The dispatched action object.
 */
export const receiveOrderDetails = (params, order) => ({
  type: RECEIVE_ORDER_DETAILS,
  ...params,
  order,
});

/**
 * Creates the dispatched ERROR_ORDER_DETAILS action object.
 * @param {Error} error An error object
 * @param {OrderDetailParams} params Request params
 * @returns {Object} The dispatched action object.
 */
export const errorOrderDetails = (error, params) => ({
  type: ERROR_ORDER_DETAILS,
  error,
  ...params,
});
