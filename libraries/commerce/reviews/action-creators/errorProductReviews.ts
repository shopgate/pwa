import { ERROR_PRODUCT_REVIEWS } from '../constants';
import type { ReviewsRequestMeta } from '../types/reviews';

/**
 * Dispatches the ERROR_PRODUCT_REVIEWS action.
 * @param productId The ID of the product
 * @param meta Request metadata.
 * @returns The ERROR_PRODUCT_REVIEWS action
 */
const errorProductReviews = (productId: string, meta: ReviewsRequestMeta = {}) => ({
  ...meta,
  type: ERROR_PRODUCT_REVIEWS as typeof ERROR_PRODUCT_REVIEWS,
  productId,
});

export type ErrorProductReviewsAction = ReturnType<typeof errorProductReviews>;

export default errorProductReviews;
