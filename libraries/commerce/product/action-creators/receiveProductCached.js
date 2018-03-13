import { RECEIVE_PRODUCT_CACHED } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT_CACHED action object.
 * @param {Object} productData The product data.
 * @return {Object} The RECEIVE_PRODUCT_CACHED action.
 */
const receiveProductCached = productData => ({
  type: RECEIVE_PRODUCT_CACHED,
  productData,
});

export default receiveProductCached;
