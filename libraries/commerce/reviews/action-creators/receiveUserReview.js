import { RECEIVE_USER_REVIEW } from '../constants';

/**
 * Dispatches the RECEIVE_USER_REVIEW action.
 * @param {string} productId The ID of the product.
 * @param {Object} review The received review data.
 * @returns {Object} The RECEIVE_USER_REVIEW action.
 */
const receiveUserReview = (productId, review) => ({
  type: RECEIVE_USER_REVIEW,
  productId,
  review,
});

export default receiveUserReview;
