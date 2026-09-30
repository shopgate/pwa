import uniq from 'lodash/uniq';
import {
  REVIEWS_LIFETIME,
  REQUEST_REVIEWS,
  RECEIVE_REVIEWS,
  ERROR_REVIEWS,
} from '../constants';

/**
 * Stores a collection of products by the related hash of the request parameters.
 * Responses are only applied when they belong to the latest request of a collection.
 * A first page replaces the collection, later pages are only appended for the same sort.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
function reviewsByHash(state = {}, action = {}) {
  switch (action.type) {
    case REQUEST_REVIEWS:
      return {
        ...state,
        [action.hash]: {
          ...state[action.hash],
          isFetching: true,
          expires: 0,
          requestId: action.requestId,
          requestOffset: action.offset,
          requestSort: action.sort,
        },
      };
    case RECEIVE_REVIEWS: {
      const collection = state[action.hash];

      if (!collection || collection.requestId !== action.requestId) {
        return state;
      }

      const nextReviewIds = (action.reviews || []).map(review => review.id);
      const isFirstPage = action.offset === 0;

      if (!isFirstPage && collection.sort !== action.sort) {
        return {
          ...state,
          [action.hash]: {
            ...collection,
            isFetching: false,
          },
        };
      }

      return {
        ...state,
        [action.hash]: {
          ...collection,
          reviews: isFirstPage
            ? uniq(nextReviewIds)
            : uniq([...(collection.reviews || []), ...nextReviewIds]),
          sort: action.sort,
          totalReviewCount: typeof action.totalReviewCount === 'number'
            ? action.totalReviewCount
            : null,
          isFetching: false,
          expires: Date.now() + REVIEWS_LIFETIME,
        },
      };
    }
    case ERROR_REVIEWS: {
      const collection = state[action.hash];

      if (!collection || collection.requestId !== action.requestId) {
        return state;
      }

      return {
        ...state,
        [action.hash]: {
          ...collection,
          isFetching: false,
          expires: 0,
        },
      };
    }
    default:
      return state;
  }
}

export default reviewsByHash;
