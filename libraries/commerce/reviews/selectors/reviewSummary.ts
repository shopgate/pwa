import { createSelector } from 'reselect';
import { getProductRating as getProductRatingSelector } from '../../product/selectors/product';
import type { ReviewsProductProps } from '../types/reviews';
import type { ReviewSummary } from '../types/reviewSummary';

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
 * @param state The application state.
 * @param props The product id and an optional variant id, which takes precedence.
 * @returns The summary, or null when the product or its rating is not available.
 */
export const getReviewSummary = createSelector(
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
