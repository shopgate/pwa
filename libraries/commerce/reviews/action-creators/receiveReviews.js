import { RECEIVE_REVIEWS } from '../constants';

/**
 * Dispatches the RECEIVE_REVIEWS action.
 * @param {string} hash Generated hash for an entity.
 * @param {string} productId The ID of the product.
 * @param {Array} reviews The received review data.
 * @param {number} totalReviewCount The total number of reviews for a product.
 * @param {Object} [meta={}] Request metadata.
 * @param {number} [meta.requestId] Identifies the request that the response belongs to.
 * @param {number} [meta.offset] The requested list offset.
 * @param {string} [meta.sort] The requested sort order.
 * @returns {Object} The RECEIVE_PRODUCT_REVIEWS action.
 */
const receiveReviews = (hash, productId, reviews, totalReviewCount, meta = {}) => ({
  ...meta,
  type: RECEIVE_REVIEWS,
  hash,
  productId,
  reviews,
  totalReviewCount,
});

export default receiveReviews;
