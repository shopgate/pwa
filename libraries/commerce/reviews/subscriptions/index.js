import appConfig from '@shopgate/pwa-common/helpers/config';
import { appWillStart$ } from '@shopgate/pwa-common/streams';
import fetchProductReviews from '../actions/fetchProductReviews';
import fetchProductReviewSettings from '../actions/fetchProductReviewSettings';
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

  subscribe(appWillStart$, ({ dispatch }) => {
    dispatch(fetchProductReviewSettings());
  });

  subscribe(shouldFetchReviews$, ({ action, dispatch }) => {
    dispatch(fetchProductReviewSettings());

    if (action.productData) {
      const { id, baseProductId } = action.productData;
      dispatch(fetchProductReviews(baseProductId || id, REVIEW_PREVIEW_COUNT));
    }

    if (action.review) {
      dispatch(fetchProductReviews(action.review.productId, REVIEW_PREVIEW_COUNT));
    }
  });
}
