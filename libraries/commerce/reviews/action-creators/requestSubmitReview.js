import { REQUEST_SUBMIT_REVIEW } from '../constants';

/**
 * Dispatches the REQUEST_SUBMIT_REVIEW action.
 * @param {Object} review The review data.
 * @returns {Object} The REQUEST_SUBMIT_REVIEW action.
 */
const requestSubmitReview = review => ({
  type: REQUEST_SUBMIT_REVIEW,
  review,
});

export default requestSubmitReview;
