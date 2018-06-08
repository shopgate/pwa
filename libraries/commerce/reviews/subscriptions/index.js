import appConfig from '@shopgate/pwa-common/helpers/config';
import getProductReviews from '../actions/getProductReviews';
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
    const { id, baseProductId } = action.productData;
    dispatch(getProductReviews(baseProductId || id, 2));
  });
}
