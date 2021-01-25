import { DELETE_PRODUCTS_BY_IDS } from '../constants';

/**
 * Creates the dispatched DELETE_PRODUCTS_BY_IDS action object.
 * @param {string[]} productIds Ids of the products to be set as expired.
 * @param {boolean} [complete=false] if product should be removed from lists.
 * @returns {Object} The dispatched action object.
 */
const deleteProductsByIds = (productIds = [], complete = false) => ({
  type: DELETE_PRODUCTS_BY_IDS,
  productIds,
  complete,
});

export default deleteProductsByIds;
