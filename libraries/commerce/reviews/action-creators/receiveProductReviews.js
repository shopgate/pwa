import { RECEIVE_PRODUCT_REVIEWS } from '../constants';

/**
 * Dispatches the RECEIVE_PRODUCT_REVIEWS action.
 * @param {string} productId The ID of the product
 * @param {Object} reviews The received review data
 * @param {number} totalReviewCount The total number of reviews for a product
 * @param {Object} [meta={}] Request metadata.
 * @param {number} [meta.requestId] Identifies the request that the response belongs to.
 * @param {string} [meta.sort] The requested sort order.
 * @returns {Object} The RECEIVE_PRODUCT_REVIEWS action
 */
const receiveProductReviews = (productId, reviews, totalReviewCount, meta = {}) => ({
  ...meta,
  type: RECEIVE_PRODUCT_REVIEWS,
  productId,
  reviews,
  totalReviewCount,
});

export default receiveProductReviews;
