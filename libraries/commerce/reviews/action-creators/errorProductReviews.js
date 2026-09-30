import { ERROR_PRODUCT_REVIEWS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_REVIEWS action.
 * @param {string} productId The ID of the product
 * @param {Object} [meta={}] Request metadata.
 * @param {number} [meta.requestId] Identifies the request that the error belongs to.
 * @returns {Object} The ERROR_PRODUCT_REVIEWS action
 */
const errorProductReviews = (productId, meta = {}) => ({
  ...meta,
  type: ERROR_PRODUCT_REVIEWS,
  productId,
});

export default errorProductReviews;
