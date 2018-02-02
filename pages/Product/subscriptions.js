/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { getCurrentProductVariantId } from '@shopgate/pwa-common-commerce/product/selectors/variants';
import getProductReviews from '@shopgate/pwa-common-commerce/reviews/actions/getProductReviews';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import getProduct from '@shopgate/pwa-common-commerce/product/actions/getProduct';
import { getCurrentBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import appConfig from '@shopgate/pwa-common/helpers/config';
import getProductData from './actions/getProductData';
import { REVIEW_PREVIEW_COUNT } from './constants';

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
    const variantId = getCurrentProductVariantId(getState());
    dispatch(getProductData(variantId));

    dispatch(enableNavigatorSearch());
    if (appConfig.hasReviews) {
      const baseProductId = getCurrentBaseProductId(getState());
      dispatch(getProductReviews(baseProductId, REVIEW_PREVIEW_COUNT));
    }
  });
}
