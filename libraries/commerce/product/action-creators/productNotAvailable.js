import { PRODUCT_NOT_AVAILABLE } from '../constants';

/**
 * Creates the dispatched PRODUCT_NOT_AVAILABLE action object.
 * @param {string} productId Ids of the products to be set as expired.
 * @param {string|Symbol} reason unavailable reason.
 * @returns {Object} The dispatched action object.
 */
const productNotAvailable = (productId, reason) => ({
  type: PRODUCT_NOT_AVAILABLE,
  productId,
  reason,
});

export default productNotAvailable;
