import { RESET_SUBMIT_REVIEW } from '../constants';

/**
 * Dispatches the RESET_SUBMIT_REVIEW action.
 * @param {Object} review Review data to which the state should reset to.
 * @returns {Object} The RESET_SUBMIT_REVIEW action.
 */
const resetSubmittedReview = review => ({
  type: RESET_SUBMIT_REVIEW,
  review,
});

export default resetSubmittedReview;
