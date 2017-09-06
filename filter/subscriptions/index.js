/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  routeDidEnter,
  historyDidUpdate$,
} from '@shopgate/pwa-common/streams/history';
import {
  mergeTemporaryFilters,
  setTemporaryFilters,
} from '../action-creators';
import {
  addActiveFilters,
  syncActiveFiltersWithHistory,
} from '../actions';
import { getActiveFilters } from '../selectors';
import { FILTER_PATH } from '../constants';
import { CATEGORY_PATH } from '../../category/constants';
import { SEARCH_PATH } from '../../search/constants';

/**
 * Filters subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filters(subscribe) {
  /**
   * Gets triggered when entering a filterable route.
   */
  const filterableRoutesDidEnter$ = routeDidEnter(CATEGORY_PATH).merge(routeDidEnter(SEARCH_PATH));

  subscribe(filterableRoutesDidEnter$, ({ dispatch }) => {
    dispatch(addActiveFilters());
  });

  /**
   * Gets triggered when entering a filterable route NOT coming from filters.
   */
  const newFilterableRoutesEntered$ = filterableRoutesDidEnter$.filter(
    ({ prevPathname }) => !prevPathname.startsWith(FILTER_PATH)
  );

  subscribe(newFilterableRoutesEntered$, ({ dispatch }) => {
    dispatch(mergeTemporaryFilters({}));
  });

  /**
   * Gets triggered when entering the filter route.
   */
  const filterRouteDidEnter$ = routeDidEnter(FILTER_PATH);

  subscribe(filterRouteDidEnter$, ({ dispatch, getState }) =>
    dispatch(setTemporaryFilters(getActiveFilters(getState())))
  );

  /**
   * Gets triggered on every history update.
   */
  subscribe(historyDidUpdate$, ({ dispatch }) => {
    dispatch(syncActiveFiltersWithHistory());
  });
}
