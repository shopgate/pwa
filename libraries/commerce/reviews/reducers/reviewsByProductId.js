import {
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
  REQUEST_SUBMIT_REVIEW,
  REVIEWS_LIFETIME,
} from '../constants';

/**
 * Stores product reviews by their product ID.
 * Responses are only applied when they belong to the latest request of a product.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function reviewsByProductId(state = {}, action = {}) {
  switch (action.type) {
    case REQUEST_PRODUCT_REVIEWS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          expires: 0,
          requestId: action.requestId,
        },
      };
    case RECEIVE_PRODUCT_REVIEWS: {
      const collection = state[action.productId];

      if (!collection || collection.requestId !== action.requestId) {
        return state;
      }

      return {
        ...state,
        [action.productId]: {
          ...collection,
          isFetching: false,
          reviews: action.reviews.map(review => review.id),
          sort: action.sort,
          totalReviewCount: typeof action.totalReviewCount === 'number'
            ? action.totalReviewCount
            : null,
          expires: Date.now() + REVIEWS_LIFETIME,
        },
      };
    }
    case ERROR_PRODUCT_REVIEWS: {
      const collection = state[action.productId];

      if (!collection || collection.requestId !== action.requestId) {
        return state;
      }

      return {
        ...state,
        [action.productId]: {
          ...collection,
          isFetching: false,
          expires: 0,
        },
      };
    }
    case REQUEST_SUBMIT_REVIEW:
      return {
        ...state,
        [action.review.productId]: {
          ...(state[action.review.productId] || {}),
          expires: 0,
        },
      };
    default:
      return state;
  }
}
