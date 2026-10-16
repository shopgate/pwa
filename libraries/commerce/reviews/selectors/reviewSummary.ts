import { createSelector } from 'reselect';
import { getProductRating as getProductRatingSelector } from '../../product/selectors/product';
import { REVIEW_FEATURE_RATING_SUMMARY } from '../constants';
import { hasReviewFeature } from './reviewSettings';
import type { ReviewsProductProps, ReviewsSliceState } from '../types/reviews';
import type { ReviewSummary } from '../types/reviewSummary';

type SummaryState = {
  product: unknown;
  reviews?: Partial<ReviewsSliceState>;
};

type ProductRating = {
  average?: unknown;
  count?: unknown;
};

const getProductRating = getProductRatingSelector as (
  state: { product: unknown },
  props?: ReviewsProductProps
) => ProductRating | null | undefined;

/**
 * Normalizes a raw rating value.
 * @param value A raw rating value from the product data.
 * @returns The value when it is a finite number, otherwise null.
 */
const toFiniteNumber = (value: unknown): number | null => (
  typeof value === 'number' && Number.isFinite(value) ? value : null
);

/**
 * Selects the review summary of a product from its product data.
 */
const getProductReviewSummary = createSelector(
  getProductRating,
  (rating): ReviewSummary | null => {
    if (!rating) {
      return null;
    }

    return {
      average: toFiniteNumber(rating.average),
      count: toFiniteNumber(rating.count),
    };
  }
);

/**
 * Selects the review summary of a product. A summary delivered by the review provider wins.
 * Without one the product data is the source, unless the provider reports that it delivers
 * summaries: then the product data describes another dataset and is not used.
 * @param state The application state.
 * @param props The product id and an optional variant id, which takes precedence for the
 * product data. Provider summaries are stored by the product id.
 * @returns The summary, or null when none is available.
 */
export const getReviewSummary = (state: SummaryState, props: ReviewsProductProps = {}) => {
  const providerSummary = props.productId
    ? state.reviews?.reviewSummariesByProductId?.[props.productId]
    : undefined;

  if (providerSummary) {
    return providerSummary;
  }

  if (hasReviewFeature(state, REVIEW_FEATURE_RATING_SUMMARY)) {
    return null;
  }

  return getProductReviewSummary(state, props);
};
