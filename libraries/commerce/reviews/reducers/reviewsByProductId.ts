import type { Reducer } from 'redux';
import {
  REQUEST_PRODUCT_REVIEWS,
  RECEIVE_PRODUCT_REVIEWS,
  ERROR_PRODUCT_REVIEWS,
  REQUEST_SUBMIT_REVIEW,
  REVIEWS_LIFETIME,
} from '../constants';
import type { RequestProductReviewsAction } from '../action-creators/requestProductReviews';
import type { ReceiveProductReviewsAction } from '../action-creators/receiveProductReviews';
import type { ErrorProductReviewsAction } from '../action-creators/errorProductReviews';
import type { ReviewsByProductId } from '../types/reviews';

type RequestSubmitReviewAction = {
  type: typeof REQUEST_SUBMIT_REVIEW;
  review: {
    productId: string;
  };
};

type ReviewsByProductIdAction =
  | RequestProductReviewsAction
  | ReceiveProductReviewsAction
  | ErrorProductReviewsAction
  | RequestSubmitReviewAction;

/**
 * Stores product reviews by their product ID.
 * Responses are only applied when they belong to the latest request of a product.
 * @param state The current state.
 * @param action The action object.
 * @returns The new state.
 */
const reviewsByProductId: Reducer<ReviewsByProductId, ReviewsByProductIdAction> = (
  state = {},
  action = {} as ReviewsByProductIdAction
) => {
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
};

export default reviewsByProductId;
