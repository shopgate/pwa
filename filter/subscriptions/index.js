/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { routeDidEnter, routeDidLeave, historyDidUpdate$ } from '@shopgate/pwa-common/streams/history';
import mergeTemporaryFilters from '../action-creators/mergeTemporaryFilters';
import setFilterHash from '../action-creators/setFilterHash';
import setTemporaryFilters from '../action-creators/setTemporaryFilters';
import addActiveFilters from '../actions/addActiveFilters';
import syncActiveFiltersWithHistory from '../actions/syncActiveFiltersWithHistory';
import { getActiveFilters, getFilterHash } from '../selectors';
import { FILTER_PATH } from '../constants';
import { CATEGORY_PATH } from '../../category/constants';
import { SEARCH_PATH } from '../../search/constants';

/**
 * Filters subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filters(subscribe) {
  /**
   * Gets triggered when entering the filter route.
   */
  const filterRouteDidEnter$ = routeDidEnter(FILTER_PATH);

  /**
   * Gets triggered when leaving the filter route.
   */
  const filterRouteDidLeave$ = routeDidLeave(FILTER_PATH);

  /**
   * Gets triggered when entering a filterable route.
   */
  const filterableRoutesDidEnter$ = routeDidEnter(CATEGORY_PATH).merge(routeDidEnter(SEARCH_PATH));

  /**
   * Gets triggered when entering a filterable route NOT coming from filters.
   */
  const newFilterableRoutesEntered$ = filterableRoutesDidEnter$.filter(
    ({ prevPathname }) => !prevPathname.startsWith(FILTER_PATH)
  );

  subscribe(filterRouteDidLeave$, ({ dispatch }) => {
    dispatch(setFilterHash(''));
  });

  subscribe(filterRouteDidEnter$, ({ dispatch, getState, prevState }) => {
    dispatch(setTemporaryFilters(getActiveFilters(getState())));
    dispatch(setFilterHash(getFilterHash(prevState)));
  });

  subscribe(filterableRoutesDidEnter$, ({ dispatch }) => {
    dispatch(addActiveFilters());
  });

  subscribe(newFilterableRoutesEntered$, ({ dispatch }) => {
    dispatch(mergeTemporaryFilters({}));
  });

  /**
   * Gets triggered on every history update.
   */
  subscribe(historyDidUpdate$, ({ dispatch }) => {
    dispatch(syncActiveFiltersWithHistory());
  });
}
