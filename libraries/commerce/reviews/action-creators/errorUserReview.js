import { ERROR_USER_REVIEW } from '../constants';

/**
 * Dispatches the ERROR_USER_REVIEW action.
 * @param {string} productId The ID of the product.
 * @returns {Object} The ERROR_USER_REVIEW action.
 */
const errorUserReview = productId => ({
  type: ERROR_USER_REVIEW,
  productId,
});

export default errorUserReview;
