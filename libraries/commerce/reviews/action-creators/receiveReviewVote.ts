import { RECEIVE_REVIEW_VOTE } from '../constants';
import type { ReviewId, ReviewVoteCounts, ReviewVote } from '../types/reviews';

/**
 * Dispatches the RECEIVE_REVIEW_VOTE action.
 * @param reviewId The ID of the review that was voted on.
 * @param vote The vote of the user.
 * @param reviewVotes The vote counts of the review after the vote.
 * @returns The RECEIVE_REVIEW_VOTE action.
 */
const receiveReviewVote = (
  reviewId: ReviewId,
  vote: ReviewVote,
  reviewVotes: ReviewVoteCounts
) => ({
  type: RECEIVE_REVIEW_VOTE as typeof RECEIVE_REVIEW_VOTE,
  reviewId,
  vote,
  reviewVotes,
});

export type ReceiveReviewVoteAction = ReturnType<typeof receiveReviewVote>;

export default receiveReviewVote;
