/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';

/**
 * Navigator subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filterbar(subscribe) {
  // Derived streams.
  const searchRouteDidEnter$ = routeDidEnter(SEARCH_PATH);

  /**
   * Gets triggered on entering the search route.
   */
  subscribe(searchRouteDidEnter$, ({ dispatch }) => {
    dispatch(getFilters());
  });
}
