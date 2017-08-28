/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import {
  setFilterOpened,
  setFilterClosed,
} from 'Components/Navigator/action-creators';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filter(subscribe) {
  const filterRouteDidEnter$ = routeDidEnter(FILTER_PATH);
  const filterRouteDidLeave$ = routeDidLeave(FILTER_PATH);

  /**
   * Gets triggered on entering the filter route.
   */
  subscribe(filterRouteDidEnter$, ({ dispatch }) => {
    dispatch(setFilterOpened());
  });

  /**
   * Gets triggered on leaving the filter route.
   */
  subscribe(filterRouteDidLeave$, ({ dispatch }) => {
    dispatch(setFilterClosed());
  });
}
