import appConfig from '@shopgate/pwa-common/helpers/config';
import getProductReviews from '../actions/getProductReviews';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import { shouldFetchReviews$ } from '../streams';

/**
 * Review subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  if (!appConfig.hasReviews) {
    return;
  }

  subscribe(shouldFetchReviews$, ({ action, dispatch }) => {
    if (action.productData) {
      const { id, baseProductId } = action.productData;
      dispatch(getProductReviews(baseProductId || id, REVIEW_PREVIEW_COUNT));
    }

    if (action.review) {
      dispatch(getProductReviews(action.review.productId, REVIEW_PREVIEW_COUNT));
    }
  });
}
