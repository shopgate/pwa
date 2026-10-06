import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import fetchProduct from '@shopgate/pwa-common-commerce/product/actions/fetchProduct';
import { getBaseProductId, getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { REVIEW_ITEMS_PER_PAGE } from '@shopgate/pwa-common-commerce/reviews/constants';
import { reviewsWillEnter$ } from '@shopgate/pwa-common-commerce/reviews/streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function reviews(subscribe) {
  subscribe(reviewsWillEnter$, ({ dispatch, action, getState }) => {
    const productId = hex2bin(action.route.params.productId);
    const state = getState();

    dispatch(fetchProduct(productId));

    if (getProduct(state, { productId })) {
      dispatch(fetchReviews(getBaseProductId(state, { productId }), REVIEW_ITEMS_PER_PAGE));
    }
  });
}
