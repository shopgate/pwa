import { ACTION_POP } from '@virtuous/conductor';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import fetchProduct from '@shopgate/pwa-common-commerce/product/actions/fetchProduct';
import { getBaseProductId, getProduct } from '@shopgate/engage/product/selectors/product';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { REVIEW_ITEMS_PER_PAGE } from '@shopgate/pwa-common-commerce/reviews/constants';
import {
  getReviewListFilters,
  getReviewListSort,
} from '@shopgate/pwa-common-commerce/reviews/selectors';
import { reviewsWillEnter$ } from '@shopgate/pwa-common-commerce/reviews/streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function reviews(subscribe) {
  subscribe(reviewsWillEnter$, ({ dispatch, action, getState }) => {
    const productId = hex2bin(action.route.params.productId);
    const state = getState();

    dispatch(fetchProduct(productId));

    if (!getProduct(state, { productId })) {
      return;
    }

    const baseProductId = getBaseProductId(state, { productId });

    if (action.historyAction !== ACTION_POP) {
      dispatch(fetchReviews(baseProductId, REVIEW_ITEMS_PER_PAGE));
      return;
    }

    const listProps = {
      productId,
      variantId: null,
    };

    dispatch(fetchReviews(
      baseProductId,
      REVIEW_ITEMS_PER_PAGE,
      0,
      getReviewListSort(state, listProps),
      getReviewListFilters(state, listProps)
    ));
  });
}
