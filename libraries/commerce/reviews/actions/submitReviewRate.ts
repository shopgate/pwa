import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import type { Dispatch } from 'redux';
import { SHOPGATE_CATALOG_ADD_PRODUCT_REVIEW_RATE } from '../constants/Pipelines';
import receiveReviewRate from '../action-creators/receiveReviewRate';
import { getReviews, getReviewVote } from '../selectors';
import type {
  ReviewId,
  ReviewRate,
  ReviewsState,
  ReviewVote,
  ReviewVotesState,
} from '../types/reviews';

type SubmitReviewRateState = ReviewsState & ReviewVotesState;

const pendingReviewIds = new Set<string>();

/**
 * Submits a helpfulness vote for a review.
 * @param reviewId The ID of the review.
 * @param rate The vote of the user.
 * @returns The dispatched action. It resolves with `null` when the user already voted on the
 * review or a vote for it is still in flight.
 */
function submitReviewRate(reviewId: ReviewId, rate: ReviewVote) {
  return (dispatch: Dispatch, getState: () => SubmitReviewRateState) => {
    const key = String(reviewId);

    if (pendingReviewIds.has(key) || getReviewVote(getState(), reviewId)) {
      return Promise.resolve(null);
    }

    pendingReviewIds.add(key);

    const request = new PipelineRequest(SHOPGATE_CATALOG_ADD_PRODUCT_REVIEW_RATE)
      .setInput({
        reviewId,
        rate,
      })
      .setRetries(0)
      .setHandleErrors(ERROR_HANDLE_SUPPRESS)
      .dispatch();

    request
      .then((result?: ReviewRate) => {
        pendingReviewIds.delete(key);

        const current = getReviews(getState())[key]?.reviewRate;
        const hasCounts = typeof result?.up === 'number' && typeof result?.down === 'number';

        dispatch(receiveReviewRate(reviewId, rate, hasCounts ? {
          up: result.up,
          down: result.down,
        } : {
          ...current,
          [rate]: (current?.[rate] ?? 0) + 1,
        }));
      })
      .catch(() => {
        pendingReviewIds.delete(key);
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(submitReviewRate);
