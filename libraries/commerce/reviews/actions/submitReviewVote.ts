import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import type { Dispatch } from 'redux';
import { SHOPGATE_CATALOG_ADD_PRODUCT_REVIEW_VOTE } from '../constants/Pipelines';
import receiveReviewVote from '../action-creators/receiveReviewVote';
import { getReviews, getOwnReviewVote } from '../selectors';
import type {
  ReviewId,
  ReviewVoteCounts,
  ReviewsState,
  ReviewVote,
  OwnReviewVotesState,
} from '../types/reviews';

type SubmitReviewVoteState = ReviewsState & OwnReviewVotesState;

const pendingReviewIds = new Set<string>();

/**
 * Submits a helpfulness vote for a review.
 * @param reviewId The ID of the review.
 * @param vote The vote of the user.
 * @returns The dispatched action. It resolves with `null` when the user already voted on the
 * review or a vote for it is still in flight.
 */
function submitReviewVote(reviewId: ReviewId, vote: ReviewVote) {
  return (dispatch: Dispatch, getState: () => SubmitReviewVoteState) => {
    const key = String(reviewId);

    if (pendingReviewIds.has(key) || getOwnReviewVote(getState(), reviewId)) {
      return Promise.resolve(null);
    }

    pendingReviewIds.add(key);

    const request = new PipelineRequest(SHOPGATE_CATALOG_ADD_PRODUCT_REVIEW_VOTE)
      .setInput({
        reviewId,
        vote,
      })
      .setRetries(0)
      .setHandleErrors(ERROR_HANDLE_SUPPRESS)
      .dispatch();

    request
      .then((result?: ReviewVoteCounts) => {
        pendingReviewIds.delete(key);

        const current = getReviews(getState())[key]?.reviewVotes;
        const hasCounts = typeof result?.up === 'number' && typeof result?.down === 'number';

        dispatch(receiveReviewVote(reviewId, vote, hasCounts ? {
          up: result.up,
          down: result.down,
        } : {
          ...current,
          [vote]: (current?.[vote] ?? 0) + 1,
        }));
      })
      .catch(() => {
        pendingReviewIds.delete(key);
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(submitReviewVote);
