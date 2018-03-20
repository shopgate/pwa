import { REQUEST_USER_REVIEW } from '../constants';

/**
 * Dispatches the REQUEST_USER_REVIEW action.
 * @param {string} productId The ID of the product.
 * @returns {Object} The REQUEST_USER_REVIEW action.
 */
const requestUserReview = productId => ({
  type: REQUEST_USER_REVIEW,
  productId,
});

export default requestUserReview;
