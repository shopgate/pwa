import { ACTION_REPLACE } from '@virtuous/conductor';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  routeWillEnter$,
  routeDidEnter$,
  routeWillLeave$,
  routeDidUpdate$,
} from '@shopgate/pwa-common/streams/router';
import { HISTORY_POP_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
import { filtersDidUpdate$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import {
  preferredLocationDidUpdate$,
  preferredLocationDidUpdateGlobalNotOnSearch$,
  preferredLocationDidUpdateGlobalOnSearch$,
} from '@shopgate/engage/locations/locations.streams';
import { filterWillLeave$ } from '../../filter/streams';
import {
  REQUEST_SEARCH_RESULTS,
  RECEIVE_SEARCH_RESULTS,
  ERROR_SEARCH_RESULTS,
  SEARCH_PATTERN,
} from '../constants';

/**
 * Gets triggered when search results are requested.
 * @type {Observable}
 */
export const searchRequesting$ = main$.filter(({ action }) => (
  action.type === REQUEST_SEARCH_RESULTS
));

/**
 * Gets triggered when search results are received.
 * @type {Observable}
 */
export const searchReceived$ = main$.filter(({ action }) => (
  action.type === RECEIVE_SEARCH_RESULTS ||
  action.type === ERROR_SEARCH_RESULTS
));

export const searchWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === SEARCH_PATTERN);

export const searchDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === SEARCH_PATTERN);

export const searchWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === SEARCH_PATTERN);

export const searchWillUpdate$ = routeWillEnter$
  .filter(({ action }) =>
    action.route.pattern === SEARCH_PATTERN &&
    action.historyAction === ACTION_REPLACE);

export const searchDidBackEntered$ = searchDidEnter$.filter(
  ({ action }) => action.historyAction === HISTORY_POP_ACTION
);

export const searchFiltersDidUpdate$ = filtersDidUpdate$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === SEARCH_PATH);
  });

export const searchProductsNeedUpdate$ = preferredLocationDidUpdate$
  .merge(preferredLocationDidUpdateGlobalNotOnSearch$)
  .switchMap(() => searchDidBackEntered$.first())
  .merge(searchFiltersDidUpdate$)
  .merge(preferredLocationDidUpdateGlobalOnSearch$);

export const searchDidUpdate$ = routeDidUpdate$
  .filter(({ action }) => action?.route?.pattern === SEARCH_PATTERN);

export const searchFiltersDidUpdateFromFilterPage$ = searchDidUpdate$
  .switchMap(() => filterWillLeave$.first())
  .switchMap(() => searchWillEnter$.first());
