import { FLUSH_USER_REVIEWS } from '../constants';

/**
 * Dispatches the FLUSH_USER_REVIEWS action.
 * @returns {Object} The FLUSH_USER_REVIEWS action
 */
const receiveProductReviews = () => ({
  type: FLUSH_USER_REVIEWS,
});

export default receiveProductReviews;
