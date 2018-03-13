import { RECEIVE_PRODUCT } from '../constants';

/**
 * Creates the dispatched RECEIVE_PRODUCT action object.
 * @param {string} productId The ID of the received product.
 * @param {Object} productData The data of the received product.
 * @return {Object} The RECEIVE_PRODUCT action.
 */
const receiveProduct = (productId, productData) => ({
  type: RECEIVE_PRODUCT,
  productId,
  productData,
});

export default receiveProduct;
