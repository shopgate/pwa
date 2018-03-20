import { RECEIVE_PRODUCTS } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCTS action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @param {Object} payload.products The data of the received products.
 * @param {boolean} payload.cached If the result should be cached.
 * @return {Object} The RECEIVE_PRODUCTS action.
 */
const receiveProducts = payload => ({
  type: RECEIVE_PRODUCTS,
  ...payload,
});

export default receiveProducts;
