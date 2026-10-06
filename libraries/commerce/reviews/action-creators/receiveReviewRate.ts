import { RECEIVE_REVIEW_RATE } from '../constants';
import type { ReviewId, ReviewRate, ReviewVote } from '../types/reviews';

/**
 * Dispatches the RECEIVE_REVIEW_RATE action.
 * @param reviewId The ID of the review that was voted on.
 * @param rate The vote of the user.
 * @param reviewRate The vote counts of the review after the vote.
 * @returns The RECEIVE_REVIEW_RATE action.
 */
const receiveReviewRate = (reviewId: ReviewId, rate: ReviewVote, reviewRate: ReviewRate) => ({
  type: RECEIVE_REVIEW_RATE as typeof RECEIVE_REVIEW_RATE,
  reviewId,
  rate,
  reviewRate,
});

export type ReceiveReviewRateAction = ReturnType<typeof receiveReviewRate>;

export default receiveReviewRate;
