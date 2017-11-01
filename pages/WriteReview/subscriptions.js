/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import {
  getCurrentProductId,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  requestReviewSubmit$,
  responseReviewSubmit$,
  successReviewSubmit$,
} from '@shopgate/pwa-common-commerce/reviews/streams';
import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';
import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { getUserReviewForProduct } from '@shopgate/pwa-common-commerce/reviews/selectors';
import getUserReview from '@shopgate/pwa-common-commerce/reviews/actions/getUserReview';

/**
 * Products subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function writeReview(subscribe) {
  const reviewsRouteDidEnter$ = routeDidEnter(ITEM_PATH);

  /**
   * Gets triggered on entering the write review route.
   */
  subscribe(reviewsRouteDidEnter$, ({ dispatch, getState }) => {
    const state = getState();
    const review = getUserReviewForProduct(state);

    // Only dispatch when review is not yet in store
    if (!Object.keys(review).length) {
      dispatch(getUserReview(getCurrentProductId(state)));
    }
  });

  subscribe(requestReviewSubmit$, ({ dispatch, getState }) => {
    dispatch(setViewLoading(getHistoryPathname(getState())));
  });

  subscribe(responseReviewSubmit$, ({ dispatch, getState }) => {
    dispatch(unsetViewLoading(getHistoryPathname(getState())));
  });

  subscribe(successReviewSubmit$, ({ dispatch }) => {
    dispatch(goBackHistory());
    dispatch(showModal({
      dismiss: 'modal.ok',
      confirm: 'reviews.modal_message',
      title: 'reviews.modal_title',
    }));
  });
}
