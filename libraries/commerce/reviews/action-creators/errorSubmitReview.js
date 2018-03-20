import { ERROR_SUBMIT_REVIEW } from '../constants';

/**
 * Dispatches the ERROR_SUBMIT_REVIEW action.
 * @param {string} productId The ID of the product.
 * @returns {Object} The ERROR_SUBMIT_REVIEW action.
 */
const errorSubmitReview = productId => ({
  type: ERROR_SUBMIT_REVIEW,
  productId,
});

export default errorSubmitReview;
