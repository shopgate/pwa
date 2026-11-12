import isEqual from 'lodash/isEqual';
import type { Reducer, UnknownAction } from 'redux';
import { RECEIVE_PRODUCT_REVIEWS, RECEIVE_REVIEWS } from '../constants';
import { normalizeReviewSummary } from '../helpers/summary';
import type { ReviewSummary } from '../types/reviewSummary';

type ReviewSummariesByProductId = Record<string, ReviewSummary>;

type ReceiveWithSummaryAction = UnknownAction & {
  productId?: string;
  summary?: unknown;
};

/**
 * Stores the rating summary a review provider delivers with a review list, by the product id
 * the list was requested for. The last response with a valid summary wins; a response without
 * one, or with the same numbers, keeps the stored summary.
 * @param state The current state.
 * @param action The action object.
 * @returns The new state.
 */
const reviewSummariesByProductId: Reducer<ReviewSummariesByProductId, ReceiveWithSummaryAction> = (
  state = {},
  action = { type: '' }
) => {
  if (action.type !== RECEIVE_PRODUCT_REVIEWS && action.type !== RECEIVE_REVIEWS) {
    return state;
  }

  const summary = normalizeReviewSummary(action.summary);

  if (!summary || !action.productId || isEqual(state[action.productId], summary)) {
    return state;
  }

  return {
    ...state,
    [action.productId]: summary,
  };
};

export default reviewSummariesByProductId;
