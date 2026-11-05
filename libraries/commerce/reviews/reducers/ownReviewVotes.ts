import type { Reducer, UnknownAction } from 'redux';
import { RECEIVE_REVIEW_VOTE } from '../constants';
import type { ReceiveReviewVoteAction } from '../action-creators/receiveReviewVote';
import type { OwnReviewVotes } from '../types/reviews';

type OwnReviewVotesAction = ReceiveReviewVoteAction | UnknownAction;

/**
 * Stores the votes the user of this device gave by review id.
 * @param state The current state.
 * @param action The action object.
 * @returns The new state.
 */
const ownReviewVotes: Reducer<OwnReviewVotes, OwnReviewVotesAction> = (
  state = {},
  action = { type: '' }
) => {
  if (action.type !== RECEIVE_REVIEW_VOTE) {
    return state;
  }

  const { reviewId, vote } = action as ReceiveReviewVoteAction;

  return {
    ...state,
    [String(reviewId)]: vote,
  };
};

export default ownReviewVotes;
