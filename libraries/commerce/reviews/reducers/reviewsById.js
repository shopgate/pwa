import {
  RECEIVE_PRODUCT_REVIEWS,
  RECEIVE_REVIEWS,
  RECEIVE_USER_REVIEW,
  RECEIVE_SUBMIT_REVIEW,
} from '../constants';

/**
 * Stores a collection of products by the related hash of the request parameters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
function reviewsById(state = {}, action) {
  switch (action.type) {
    case RECEIVE_PRODUCT_REVIEWS:
    case RECEIVE_REVIEWS: {
      const nextReviews = action.reviews || [];
      return nextReviews.reduce((currentReviews, review) => ({
        ...currentReviews,
        [review.id]: review,
      }), state);
    }
    case RECEIVE_SUBMIT_REVIEW:
    case RECEIVE_USER_REVIEW:
      return {
        ...state,
        [action.review.id]: action.review,
      };
    default:
      return state;
  }
}

export default reviewsById;
