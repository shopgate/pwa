/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import setActiveFilters from '@shopgate/pwa-common-commerce/filter/action-creators/setActiveFilters';
import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import toggleProgressBar from '../../components/Navigator/actions/toggleProgressBar';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  const searchRouteDidEnter$ = routeDidEnter(SEARCH_PATH);
  const searchRouteDidLeave$ = routeDidLeave(SEARCH_PATH);

  /**
   * Gets triggered on entering the search route.
   */
  subscribe(searchRouteDidEnter$, ({ dispatch }) => {
    dispatch(toggleProgressBar(false));
    alert();
    dispatch(setActiveFilters({}));
  });

  /**
   * Gets triggered on leaving the search route.
   */
  subscribe(searchRouteDidLeave$, ({ dispatch }) => {
    dispatch(toggleProgressBar(true));
  });
}
