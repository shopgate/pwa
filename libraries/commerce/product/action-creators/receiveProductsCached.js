import { RECEIVE_PRODUCTS_CACHED } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCTS_CACHED action object.
 * @param {Object} payload The action payload.
 * @param {string} payload.hash The store hash.
 * @param {Object} payload.params The criteria of the products received.
 * @param {Object} payload.products The data of the received products.
 * @return {Object} The RECEIVE_PRODUCTS_CACHED action.
 */
const receiveProductsCached = payload => ({
  type: RECEIVE_PRODUCTS_CACHED,
  ...payload,
});

export default receiveProductsCached;
