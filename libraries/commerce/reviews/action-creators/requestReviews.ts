import { REQUEST_REVIEWS } from '../constants';
import type { ReviewsRequestMeta } from '../types/reviews';

/**
 * Dispatches the REQUEST_REVIEWS action.
 * @param hash Generated hash.
 * @param meta Request metadata.
 * @returns The REQUEST_PRODUCT_REVIEWS action.
 */
const requestReviews = (hash: string, meta: ReviewsRequestMeta = {}) => ({
  ...meta,
  type: REQUEST_REVIEWS as typeof REQUEST_REVIEWS,
  hash,
});

export type RequestReviewsAction = ReturnType<typeof requestReviews>;

export default requestReviews;
