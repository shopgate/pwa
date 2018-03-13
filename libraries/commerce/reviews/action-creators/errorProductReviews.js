import { ERROR_PRODUCT_REVIEWS } from '../constants';

/**
 * Dispatches the ERROR_PRODUCT_REVIEWS action.
 * @param {string} productId The ID of the product
 * @returns {Object} The ERROR_PRODUCT_REVIEWS action
 */
const errorProductReviews = productId => ({
  type: ERROR_PRODUCT_REVIEWS,
  productId,
});

export default errorProductReviews;
