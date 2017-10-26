/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import {
  getCurrentProductId,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import getUserReview from '@shopgate/pwa-common-commerce/reviews/actions/getUserReview';

/**
 * Products subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function writeReview(subscribe) {
  const reviewsRouteDidEnter$ = routeDidEnter(ITEM_PATH).filter(
    ({ pathname }) => pathname.endsWith('write_review') || pathname.endsWith('write_review/')
  );

  /**
   * Gets triggered on entering the write review route.
   */
  subscribe(reviewsRouteDidEnter$, ({ dispatch, getState }) => {
    dispatch(getUserReview(getCurrentProductId(getState())));
  });
}

