import { ERROR_REVIEWS } from '../constants';

/**
 * Dispatches the ERROR_REVIEWS action.
 * @param {string} hash Generated hash.
 * @param {Object} [meta={}] Request metadata.
 * @param {number} [meta.requestId] Identifies the request that the error belongs to.
 * @returns {Object} The ERROR_PRODUCT_REVIEWS action.
 */
const errorProductReviews = (hash, meta = {}) => ({
  ...meta,
  type: ERROR_REVIEWS,
  hash,
});

export default errorProductReviews;
