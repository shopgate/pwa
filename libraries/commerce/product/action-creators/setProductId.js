import { SET_PRODUCT_ID } from '../constants';

/**
 * Creates the dispatched SET_PRODUCT_ID action object.
 * @param {string|null} productId The product id.
 * @returns {Object} The dispatched action object.
 */
const setProductId = productId => ({
  type: SET_PRODUCT_ID,
  productId,
});

export default setProductId;
