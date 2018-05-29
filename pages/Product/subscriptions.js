// Import { main$ } from '@shopgate/pwa-common/streams/main';
// Import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
// Import appConfig from '@shopgate/pwa-common/helpers/config';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import setViewTitle from '@shopgate/pwa-common/action-creators/view/setViewTitle';
// Import { getCurrentProductVariantId } from '@shopgate/pwa-common-commerce/product/selectors/variants';
// Import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
// Import { successReviewSubmit$ } from '@shopgate/pwa-common-commerce/reviews/streams';
import getProduct from '@shopgate/pwa-common-commerce/product/actions/getProduct';
import getProductDescription from '@shopgate/pwa-common-commerce/product/actions/getProductDescription';
import getProductProperties from '@shopgate/pwa-common-commerce/product/actions/getProductProperties';
import getProductImages from '@shopgate/pwa-common-commerce/product/actions/getProductImages';
import getProductShipping from '@shopgate/pwa-common-commerce/product/actions/getProductShipping';
// Import {
//   ITEM_PATH,
//   RECEIVE_PRODUCT,
//   RECEIVE_PRODUCT_CACHED,
// } from '@shopgate/pwa-common-commerce/product/constants';
// Import getProductReviews from '@shopgate/pwa-common-commerce/reviews/actions/getProductReviews';
// Import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';
// Import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import getProductData from './actions/getProductData';
import {
  productWillEnter$,
  // WriteReviewRouteDidEnter$,
  // ReviewsRouteDidEnter$,
} from './streams';
// Import { REVIEW_PREVIEW_COUNT } from './constants';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  subscribe(productWillEnter$, ({ dispatch, action }) => {
    const { title } = action.route.state;
    const { productId } = action.route.params;
    const id = hex2bin(productId);

    if (title) dispatch(setViewTitle(title));
    dispatch(getProduct(id));
    dispatch(getProductDescription(id));
    dispatch(getProductProperties(id));
    dispatch(getProductImages(id));
    dispatch(getProductShipping(id));
    // Dispatch(getProductData(hex2bin(productId)));
    // Dispatch(enableNavigatorSearch());
  });

  /**
   * Gets triggered on entering the reviews route.
   */
  // Subscribe(reviewsRouteDidEnter$, ({ dispatch }) => {
  //   Dispatch(disableNavigatorSearch());
  // });

  /**
   * Gets triggered on entering the write reviews route.
   */
  // Subscribe(writeReviewRouteDidEnter$, ({ dispatch }) => {
  //   Dispatch(disableNavigatorSearch());
  // });

  // If (appConfig.hasReviews) {
  //   Const shouldFetchReviews$ = main$
  //     .filter(({ action }) => (
  //       Action.type === RECEIVE_PRODUCT || action.type === RECEIVE_PRODUCT_CACHED
  //     ))
  //     .merge(successReviewSubmit$);

  //   Subscribe(shouldFetchReviews$, ({ dispatch, getState }) => {
  //     Const baseProductId = getCurrentBaseProductId(getState());
  //     Dispatch(getProductReviews(baseProductId, REVIEW_PREVIEW_COUNT));
  //   });
  // }
}
