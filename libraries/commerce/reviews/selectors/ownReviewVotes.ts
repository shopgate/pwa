import type { ReviewId, ReviewVote, OwnReviewVotesState } from '../types/reviews';

/**
 * Selects the vote the user of this device gave for a review.
 * @param state The application state.
 * @param reviewId The ID of the review.
 * @returns The vote, or null when the user did not vote on the review.
 */
export const getOwnReviewVote = (
  state: OwnReviewVotesState,
  reviewId: ReviewId
): ReviewVote | null => (
  state?.ownReviewVotes?.[String(reviewId)] ?? null
);
