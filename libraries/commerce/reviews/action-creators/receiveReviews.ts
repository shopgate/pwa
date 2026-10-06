import { RECEIVE_REVIEWS } from '../constants';
import type { Review, ReviewsRequestMeta } from '../types/reviews';

/**
 * Dispatches the RECEIVE_REVIEWS action.
 * @param hash Generated hash for an entity.
 * @param productId The ID of the product.
 * @param reviews The received review data.
 * @param totalReviewCount The total number of reviews for a product.
 * @param meta Request metadata.
 * @param after The cursor for the next page as returned by the pipeline.
 * @returns The RECEIVE_PRODUCT_REVIEWS action.
 */
const receiveReviews = (
  hash: string,
  productId: string,
  reviews: Review[],
  totalReviewCount?: number | null,
  meta: ReviewsRequestMeta = {},
  after?: string | null
) => ({
  ...meta,
  type: RECEIVE_REVIEWS as typeof RECEIVE_REVIEWS,
  hash,
  productId,
  reviews,
  totalReviewCount,
  after,
});

export type ReceiveReviewsAction = ReturnType<typeof receiveReviews>;

export default receiveReviews;
