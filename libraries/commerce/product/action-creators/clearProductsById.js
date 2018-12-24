import { EXPIRE_PRODUCTS_BY_ID } from '../constants';

/**
 * Creates the dispatched EXPIRE_PRODUCTS_BY_ID action object.
 * @param {string[]} productIds Ids of the products to be set as expired.
 * @returns {Object} The dispatched action object.
 */
const expireProductsById = productIds => ({
  type: EXPIRE_PRODUCTS_BY_ID,
  productIds,
});

export default expireProductsById;
