import { appWillStart$ } from '@shopgate/engage/core/streams';
import { getShowReviews } from '@shopgate/engage/settings/selectors/appSettings';
import fetchProductReviews from '../actions/fetchProductReviews';
import fetchProductReviewSettings from '../actions/fetchProductReviewSettings';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import { reviewsDidReset$, shouldFetchReviews$ } from '../streams';

/**
 * Review subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  subscribe(appWillStart$, ({ dispatch, getState }) => {
    if (getShowReviews(getState())) {
      dispatch(fetchProductReviewSettings());
    }
  });

  subscribe(reviewsDidReset$, ({ dispatch, getState }) => {
    if (getShowReviews(getState())) {
      dispatch(fetchProductReviewSettings());
    }
  });

  subscribe(shouldFetchReviews$, ({ action, dispatch, getState }) => {
    if (!getShowReviews(getState())) {
      return;
    }

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
