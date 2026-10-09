import { RECEIVE_PRODUCT_REVIEWS } from '../constants';
import type { Review, ReviewsRequestMeta } from '../types/reviews';

/**
 * Dispatches the RECEIVE_PRODUCT_REVIEWS action.
 * @param productId The ID of the product
 * @param reviews The received review data
 * @param totalReviewCount The total number of reviews for a product
 * @param meta Request metadata.
 * @param summary The rating summary as returned by the pipeline.
 * @returns The RECEIVE_PRODUCT_REVIEWS action
 */
const receiveProductReviews = (
  productId: string,
  reviews: Review[],
  totalReviewCount?: number | null,
  meta: ReviewsRequestMeta = {},
  summary?: unknown
) => ({
  ...meta,
  type: RECEIVE_PRODUCT_REVIEWS as typeof RECEIVE_PRODUCT_REVIEWS,
  productId,
  reviews,
  totalReviewCount,
  summary,
});

export type ReceiveProductReviewsAction = ReturnType<typeof receiveProductReviews>;

export default receiveProductReviews;
