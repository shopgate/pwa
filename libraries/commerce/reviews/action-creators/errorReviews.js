import { ERROR_REVIEWS } from '../constants';

/**
 * Dispatches the ERROR_REVIEWS action.
 * @param {string} hash Generated hash.
 * @returns {Object} The ERROR_PRODUCT_REVIEWS action.
 */
const errorProductReviews = hash => ({
  type: ERROR_REVIEWS,
  hash,
});

export default errorProductReviews;
