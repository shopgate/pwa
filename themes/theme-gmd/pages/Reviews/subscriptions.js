import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { SORT_DATE_DESC } from '@shopgate/pwa-common/constants/DisplayOptions';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getCurrentReviewCount } from '@shopgate/pwa-common-commerce/reviews/selectors';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { REVIEW_ITEMS_PER_PAGE } from './constants';

/**
 * Products subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function reviews(subscribe) {
  const reviewsRouteDidEnter$ = routeDidEnter(ITEM_PATH).filter(({ pathname }) => pathname.endsWith('reviews') || pathname.endsWith('reviews/'));

  /**
   * Gets triggered on entering the reviews route.
   */
  subscribe(reviewsRouteDidEnter$, ({ dispatch, getState }) => {
    const currentCount = getCurrentReviewCount(getState());
    if (currentCount >= REVIEW_ITEMS_PER_PAGE) {
      // No need to fetch.
      return;
    }
    dispatch(fetchReviews(
      getCurrentBaseProductId(getState()),
      REVIEW_ITEMS_PER_PAGE,
      0,
      SORT_DATE_DESC
    ));
  });
}

