import { RECEIVE_REVIEWS } from '../constants';

/**
 * Dispatches the RECEIVE_REVIEWS action.
 * @param {string} hash Generated hash for an entity.
 * @param {string} productId The ID of the product.
 * @param {Array} reviews The received review data.
 * @param {number} totalReviewCount The total number of reviews for a product.
 * @returns {Object} The RECEIVE_PRODUCT_REVIEWS action.
 */
const receiveReviews = (hash, productId, reviews, totalReviewCount) => ({
  type: RECEIVE_REVIEWS,
  hash,
  productId,
  reviews,
  totalReviewCount,
});

export default receiveReviews;
