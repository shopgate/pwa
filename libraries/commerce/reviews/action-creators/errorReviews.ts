import { ERROR_REVIEWS } from '../constants';
import type { ReviewsRequestMeta } from '../types/reviews';

/**
 * Dispatches the ERROR_REVIEWS action.
 * @param hash Generated hash.
 * @param meta Request metadata.
 * @returns The ERROR_PRODUCT_REVIEWS action.
 */
const errorProductReviews = (hash: string, meta: ReviewsRequestMeta = {}) => ({
  ...meta,
  type: ERROR_REVIEWS as typeof ERROR_REVIEWS,
  hash,
});

export type ErrorReviewsAction = ReturnType<typeof errorProductReviews>;

export default errorProductReviews;
