import uniq from 'lodash/uniq';
import type { Reducer } from 'redux';
import {
  REVIEWS_LIFETIME,
  REQUEST_REVIEWS,
  RECEIVE_REVIEWS,
  ERROR_REVIEWS,
} from '../constants';
import type { RequestReviewsAction } from '../action-creators/requestReviews';
import type { ReceiveReviewsAction } from '../action-creators/receiveReviews';
import type { ErrorReviewsAction } from '../action-creators/errorReviews';
import { areReviewFiltersEqual } from '../helpers/filters';
import type { ReviewsByHash } from '../types/reviews';

type ReviewsByHashAction = RequestReviewsAction | ReceiveReviewsAction | ErrorReviewsAction;

/**
 * Stores a collection of products by the related hash of the request parameters.
 * Responses are only applied when they belong to the latest request of a collection.
 * A first page replaces the collection, later pages are only appended for the same sort and
 * filter.
 * @param state The current state.
 * @param action The current redux action.
 * @returns The new state.
 */
const reviewsByHash: Reducer<ReviewsByHash, ReviewsByHashAction> = (
  state = {},
  action = {} as ReviewsByHashAction
) => {
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
          requestFilters: action.filters,
        },
      };
    case RECEIVE_REVIEWS: {
      const collection = state[action.hash];

      if (!collection || collection.requestId !== action.requestId) {
        return state;
      }

      const nextReviewIds = (action.reviews || []).map(review => review.id);
      const isFirstPage = action.offset === 0;

      const isSameQuery = collection.sort === action.sort
        && areReviewFiltersEqual(collection.filters, action.filters);

      if (!isFirstPage && !isSameQuery) {
        return {
          ...state,
          [action.hash]: {
            ...collection,
            isFetching: false,
            expires: collection.reviews ? Date.now() + REVIEWS_LIFETIME : 0,
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
          filters: action.filters,
          totalReviewCount: typeof action.totalReviewCount === 'number'
            ? action.totalReviewCount
            : null,
          after: action.after || null,
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
};

export default reviewsByHash;
