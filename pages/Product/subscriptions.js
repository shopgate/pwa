import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import { SORT_DATE_DESC } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getCurrentProductVariantId } from '@shopgate/pwa-common-commerce/product/selectors/variants';
import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { successReviewSubmit$ } from '@shopgate/pwa-common-commerce/reviews/streams';
import getProduct from '@shopgate/pwa-common-commerce/product/actions/getProduct';
import {
  ITEM_PATH,
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCT_CACHED,
} from '@shopgate/pwa-common-commerce/product/constants';
import getProductReviews from '@shopgate/pwa-common-commerce/reviews/actions/getProductReviews';
import { REVIEW_PREVIEW_COUNT } from '@shopgate/pwa-common-commerce/reviews/constants';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import getProductData from './actions/getProductData';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  const writeReviewRouteDidEnter$ = routeDidEnter(ITEM_PATH).filter((
    ({ pathname }) => pathname.endsWith('write_review') || pathname.endsWith('write_review/')
  ));

  const reviewsRouteDidEnter$ = routeDidEnter(ITEM_PATH).filter((
    ({ pathname }) => pathname.endsWith('reviews') || pathname.endsWith('reviews/')
  ));

  const productRouteDidEnter$ = routeDidEnter(ITEM_PATH).filter((
    ({ pathname }) => !(pathname.endsWith('reviews') || pathname.endsWith('reviews/')
      || pathname.endsWith('write_review') || pathname.endsWith('write_review/'))
  ));

  /**
   * Gets triggered on entering any product route.
   */
  subscribe(routeDidEnter(ITEM_PATH), ({ dispatch, getState }) => {
    const productId = getCurrentBaseProductId(getState());
    dispatch(getProduct(productId));
  });

  /**
   * Gets triggered on entering the reviews route.
   */
  subscribe(reviewsRouteDidEnter$, ({ dispatch }) => {
    dispatch(disableNavigatorSearch());
  });

  /**
   * Gets triggered on entering the write reviews route.
   */
  subscribe(writeReviewRouteDidEnter$, ({ dispatch }) => {
    dispatch(disableNavigatorSearch());
  });

  /**
   * Gets triggered on entering the product details route.
   */
  subscribe(productRouteDidEnter$, ({ dispatch, getState }) => {
    /**
     * Ensures that the view is updated after navigating back and forth
     * through sub-pages like gallery, reviews, etc.
     */
    const state = getState();
    const variantId = getCurrentProductVariantId(state);
    dispatch(getProductData(variantId));
    dispatch(enableNavigatorSearch());
  });

  if (appConfig.hasReviews) {
    const shouldFetchReviews$ = main$
      .filter(({ action }) => (
        action.type === RECEIVE_PRODUCT || action.type === RECEIVE_PRODUCT_CACHED
      ))
      .filter(({ getState }) => getHistoryPathname(getState()).startsWith(ITEM_PATH))
      .merge(successReviewSubmit$);

    subscribe(shouldFetchReviews$, ({ dispatch, getState }) => {
      const baseProductId = getCurrentBaseProductId(getState());
      if (baseProductId) {
        dispatch(getProductReviews(baseProductId, REVIEW_PREVIEW_COUNT, SORT_DATE_DESC));
      }
    });
  }
}
