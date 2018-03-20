import { REQUEST_REVIEWS } from '../constants';

/**
 * Dispatches the REQUEST_REVIEWS action.
 * @param {string} hash Generated hash.
 * @returns {Object} The REQUEST_PRODUCT_REVIEWS action.
 */
const requestReviews = hash => ({
  type: REQUEST_REVIEWS,
  hash,
});

export default requestReviews;
