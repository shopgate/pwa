import {
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
} from '../constants';

/**
 * Stores product reviews by their product ID.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function reviewsByProductId(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCT_REVIEWS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: true,
          reviews: null,
        },
      };
    case RECEIVE_PRODUCT_REVIEWS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
          reviews: action.reviews,
        },
      };
    case ERROR_PRODUCT_REVIEWS:
      return {
        ...state,
        [action.productId]: {
          ...state[action.productId],
          isFetching: false,
        },
      };

    default:
      return state;
  }
}
