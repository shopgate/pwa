import type { Reducer } from 'redux';
import {
  RECEIVE_PRODUCT_REVIEWS,
  RECEIVE_REVIEWS,
  RECEIVE_USER_REVIEW,
  RECEIVE_SUBMIT_REVIEW,
  RECEIVE_REVIEW_VOTE,
} from '../constants';
import type { ReceiveProductReviewsAction } from '../action-creators/receiveProductReviews';
import type { ReceiveReviewsAction } from '../action-creators/receiveReviews';
import type { ReceiveReviewVoteAction } from '../action-creators/receiveReviewVote';
import type { Review, ReviewsById } from '../types/reviews';

type ReceiveSingleReviewAction = {
  type: typeof RECEIVE_SUBMIT_REVIEW | typeof RECEIVE_USER_REVIEW;
  review?: Partial<Review>;
};

type ReviewsByIdAction =
  | ReceiveProductReviewsAction
  | ReceiveReviewsAction
  | ReceiveReviewVoteAction
  | ReceiveSingleReviewAction;

/**
 * Stores a collection of products by the related hash of the request parameters.
 * @param state The current state.
 * @param action The current redux action.
 * @returns The new state.
 */
const reviewsById: Reducer<ReviewsById, ReviewsByIdAction> = (
  state = {},
  action = {} as ReviewsByIdAction
) => {
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
      if (!action.review?.id) {
        return state;
      }

      return {
        ...state,
        [action.review.id]: action.review as Review,
      };
    case RECEIVE_REVIEW_VOTE: {
      const review = state[action.reviewId];

      if (!review) {
        return state;
      }

      return {
        ...state,
        [action.reviewId]: {
          ...review,
          reviewVotes: action.reviewVotes,
        },
      };
    }
    default:
      return state;
  }
};

export default reviewsById;
