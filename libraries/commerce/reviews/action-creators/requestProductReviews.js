import { REQUEST_PRODUCT_REVIEWS } from '../constants';

/**
 * Dispatches the REQUEST_PRODUCT_REVIEWS action.
 * @param {string} productId The ID of the product
 * @param {number} limit The maximum number of reviews
 * @returns {Object} The REQUEST_PRODUCT_REVIEWS action
 */
const requestProductReviews = (productId, limit) => ({
  type: REQUEST_PRODUCT_REVIEWS,
  productId,
  limit,
});

export default requestProductReviews;
