/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  routeDidEnter,
  routeDidLeave,
  historyDidUpdate$,
} from '@shopgate/pwa-common/streams/history';
import {
  HISTORY_POP_ACTION,
  HISTORY_PUSH_ACTION,
  HISTORY_REPLACE_ACTION,
} from '@shopgate/pwa-common/constants/History';
import { HISTORY_WILL_RESET } from '@shopgate/pwa-common/constants/ActionTypes';
import {
  getHistoryPathname,
  getHistoryAction,
  getSearchPhrase,
} from '@shopgate/pwa-common/selectors/history';
import { main$ } from '@shopgate/pwa-common/streams/main';
import mergeTemporaryFilters from '../action-creators/mergeTemporaryFilters';
import setFilterHash from '../action-creators/setFilterHash';
import setTemporaryFilters from '../action-creators/setTemporaryFilters';
import addActiveFilters from '../action-creators/addActiveFilters';
import setActiveFilters from '../action-creators/setActiveFilters';
import removeActiveFilters from '../action-creators/removeActiveFilters';
import resetActiveFilters from '../action-creators/resetActiveFilters';
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
   * Gets triggered when the history will reset.
   * In that case the activeFilters stack also needs to be reset.
   */
  const historyWillReset$ = main$
    .filter(({ action }) => action.type === HISTORY_WILL_RESET);

  /**
   * Gets triggered when entering the filter route.
   */
  const filterRouteDidEnter$ = routeDidEnter(FILTER_PATH);

  /**
   * Gets triggered when leaving the filter route.
   */
  const filterRouteDidLeave$ = routeDidLeave(FILTER_PATH);

  /**
   * Gets triggered when entering a filterable route by going forward in, or replacing the history.
   */
  const filterableRoutesDidEnter$ = routeDidEnter(CATEGORY_PATH).merge(routeDidEnter(SEARCH_PATH))
    .filter(({ historyAction, initialEnter }) =>
      historyAction === HISTORY_PUSH_ACTION || initialEnter === true
    );

  /**
   * Gets triggered when leaving a filterable route by going back in history.
   */
  const filterableRoutesDidLeave$ = routeDidLeave(CATEGORY_PATH).merge(routeDidLeave(SEARCH_PATH))
    .filter(({ historyAction }) => historyAction === HISTORY_POP_ACTION);

  /**
   * Gets triggered when the search route is switched by replacing the history entry and the
   * search phrase changed.
   */
  const searchRouteWasUpdated$ = historyDidUpdate$
    .filter((input) => {
      const state = input.getState();
      const historyAction = getHistoryAction(state);

      // Check for the right history action
      if (historyAction === HISTORY_REPLACE_ACTION) {
        const pathName = getHistoryPathname(state);
        const prevPathName = getHistoryPathname(input.prevState);

        // Check if the transition happened between two search routes
        if (prevPathName.startsWith(SEARCH_PATH) && pathName.startsWith(SEARCH_PATH)) {
          const searchPhrase = getSearchPhrase(state);
          const prevSearchPhrase = getSearchPhrase(input.prevState);

          // Check if the search phrase changed
          return prevSearchPhrase !== searchPhrase;
        }
      }

      return false;
    });

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

  subscribe(newFilterableRoutesEntered$, ({ dispatch }) => {
    dispatch(mergeTemporaryFilters({}));
  });

  subscribe(filterableRoutesDidEnter$, ({ dispatch }) => {
    // Add a new placeholder object for active filters to the activeFilters stack
    dispatch(addActiveFilters());
  });

  subscribe(searchRouteWasUpdated$, ({ dispatch }) => {
    // Reset the current activeFilters object
    dispatch(setActiveFilters({}));
  });

  subscribe(filterableRoutesDidLeave$, ({ dispatch }) => {
    // Remove the last activeFilters object from the stack
    dispatch(removeActiveFilters());
  });

  subscribe(historyWillReset$, ({ dispatch }) => {
    dispatch(resetActiveFilters());
  });
}
