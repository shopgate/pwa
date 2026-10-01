import { REQUEST_PRODUCT_REVIEWS } from '../constants';
import type { ReviewsRequestMeta } from '../types/reviews';

/**
 * Dispatches the REQUEST_PRODUCT_REVIEWS action.
 * @param productId The ID of the product
 * @param limit The maximum number of reviews
 * @param meta Request metadata.
 * @returns The REQUEST_PRODUCT_REVIEWS action
 */
const requestProductReviews = (
  productId: string,
  limit: number,
  meta: ReviewsRequestMeta = {}
) => ({
  ...meta,
  type: REQUEST_PRODUCT_REVIEWS as typeof REQUEST_PRODUCT_REVIEWS,
  productId,
  limit,
});

export type RequestProductReviewsAction = ReturnType<typeof requestProductReviews>;

export default requestProductReviews;
