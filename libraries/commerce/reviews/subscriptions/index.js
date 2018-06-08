import { main$ } from '@shopgate/pwa-common/streams/main';
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCT_CACHED,
} from '@shopgate/pwa-common-commerce/product/constants';
import getProductReviews from '../actions/getProductReviews';
import { successReviewSubmit$ } from '../streams';

/**
 * Review subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  if (!appConfig.hasReviews) {
    return;
  }

  const shouldFetchReviews$ = main$
    .filter(({ action }) => (
      action.type === RECEIVE_PRODUCT || action.type === RECEIVE_PRODUCT_CACHED
    ))
    .merge(successReviewSubmit$);

  subscribe(shouldFetchReviews$, ({ action, dispatch }) => {
    const { id, baseProductId } = action.productData;
    dispatch(getProductReviews(baseProductId || id, 2));
  });
}
