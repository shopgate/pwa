import { ACTION_POP } from '@virtuous/conductor';
import { SORT_DATE_DESC } from '@shopgate/engage/core/constants';
import { hex2bin } from '@shopgate/engage/core/helpers';
import { fetchProduct } from '@shopgate/engage/product';
import { getBaseProductId, getProduct } from '@shopgate/engage/product/selectors/product';
import { fetchReviews } from '@shopgate/engage/reviews/actions';
import { REVIEW_ITEMS_PER_PAGE } from '@shopgate/engage/reviews/constants';
import { getActiveReviewFilters } from '@shopgate/pwa-common-commerce/reviews/helpers/filters';
import {
  getReviewFilterOptions,
  getReviewListFilters,
  getReviewListSort,
  isReviewListStale,
} from '@shopgate/engage/reviews/selectors';
import { reviewsWillEnter$ } from '@shopgate/engage/reviews/streams';

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
      const hasRateFilter = getReviewFilterOptions(state).some(option => option.type === 'rate');
      const filters = hasRateFilter
        ? getActiveReviewFilters({ filterRate: action.route.state?.filterRate })
        : undefined;

      dispatch(filters
        ? fetchReviews(baseProductId, REVIEW_ITEMS_PER_PAGE, 0, SORT_DATE_DESC, filters)
        : fetchReviews(baseProductId, REVIEW_ITEMS_PER_PAGE));
      return;
    }

    const listProps = {
      productId,
      variantId: null,
    };

    if (!isReviewListStale(state, listProps)) {
      return;
    }

    dispatch(fetchReviews(
      baseProductId,
      REVIEW_ITEMS_PER_PAGE,
      0,
      getReviewListSort(state, listProps),
      getReviewListFilters(state, listProps)
    ));
  });
}
