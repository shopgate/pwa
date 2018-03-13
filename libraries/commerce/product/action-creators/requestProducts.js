import { REQUEST_PRODUCTS } from '../constants';

/**
 * Creates the dispatched REQUEST_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @param {string} params The criteria of the products to request.
 * @return {Object} The REQUEST_PRODUCTS action.
 */
const requestProducts = payload => ({
  type: REQUEST_PRODUCTS,
  ...payload,
});

export default requestProducts;
