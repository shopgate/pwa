import { EXPIRE_PRODUCT_BY_ID } from '../constants';

/**
 * Creates the dispatched EXPIRE_PRODUCT_BY_ID action object.
 * @param {string} productId Ids of the products to be set as expired.
 * @returns {Object} The dispatched action object.
 */
const expireProductById = productId => ({
  type: EXPIRE_PRODUCT_BY_ID,
  productId,
});

export default expireProductById;
