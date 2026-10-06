import type { Reducer, UnknownAction } from 'redux';
import { RECEIVE_REVIEW_RATE } from '../constants';
import type { ReceiveReviewRateAction } from '../action-creators/receiveReviewRate';
import type { ReviewVotes } from '../types/reviews';

type ReviewVotesAction = ReceiveReviewRateAction | UnknownAction;

/**
 * Stores the votes the user of this device gave by review id.
 * @param state The current state.
 * @param action The action object.
 * @returns The new state.
 */
const reviewVotes: Reducer<ReviewVotes, ReviewVotesAction> = (
  state = {},
  action = { type: '' }
) => {
  if (action.type !== RECEIVE_REVIEW_RATE) {
    return state;
  }

  const { reviewId, rate } = action as ReceiveReviewRateAction;

  return {
    ...state,
    [String(reviewId)]: rate,
  };
};

export default reviewVotes;
