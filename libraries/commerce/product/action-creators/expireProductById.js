import { EXPIRE_PRODUCT_BY_ID } from '../constants';

/**
 * Creates the dispatched EXPIRE_PRODUCT_BY_ID action object.
 * @param {string|string[]} productId Ids of the products to be set as expired.
 * @param {boolean} [complete=false] if product should be removed from lists.
 * @returns {Object} The dispatched action object.
 */
const expireProductById = (productId, complete = false) => ({
  type: EXPIRE_PRODUCT_BY_ID,
  productId,
  complete,
});

export default expireProductById;
