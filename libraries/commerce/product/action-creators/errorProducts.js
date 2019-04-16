import { ERROR_PRODUCTS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @param {string} payload.errorCode The error code.
 * @return {Object} The ERROR_PRODUCTS action.
 */
const errorProducts = payload => ({
  type: ERROR_PRODUCTS,
  ...payload,
});

export default errorProducts;
