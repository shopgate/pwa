import { RECEIVE_SUBMIT_REVIEW } from '../constants';

/**
 * Dispatches the RECEIVE_SUBMIT_REVIEW action.
 * @param {Object} review The received review data.
 * @returns {Object} The RECEIVE_SUBMIT_REVIEW action.
 */
const receiveSubmitReview = review => ({
  type: RECEIVE_SUBMIT_REVIEW,
  review,
});

export default receiveSubmitReview;
