import { REQUEST_PRODUCT_REVIEWS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_REVIEWS action.
 * @param {string} productId The ID of the product
 * @param {number} limit The maximum number of reviews
 * @param {Object} [meta={}] Request metadata.
 * @param {number} [meta.requestId] Identifies the request that the response belongs to.
 * @param {string} [meta.sort] The requested sort order.
 * @returns {Object} The REQUEST_PRODUCT_REVIEWS action
 */
const requestProductReviews = (productId, limit, meta = {}) => ({
  ...meta,
  type: REQUEST_PRODUCT_REVIEWS,
  productId,
  limit,
});

export default requestProductReviews;
