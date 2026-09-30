import { REQUEST_REVIEWS } from '../constants';

/**
 * Dispatches the REQUEST_REVIEWS action.
 * @param {string} hash Generated hash.
 * @param {Object} [meta={}] Request metadata.
 * @param {number} [meta.requestId] Identifies the request that the response belongs to.
 * @param {number} [meta.offset] The requested list offset.
 * @param {string} [meta.sort] The requested sort order.
 * @returns {Object} The REQUEST_PRODUCT_REVIEWS action.
 */
const requestReviews = (hash, meta = {}) => ({
  ...meta,
  type: REQUEST_REVIEWS,
  hash,
});

export default requestReviews;
