import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeWillEnter$, routeWillLeave$ } from '@shopgate/pwa-common/streams/router';
import {
  REQUEST_SEARCH_RESULTS,
  RECEIVE_SEARCH_RESULTS,
  ERROR_SEARCH_RESULTS,
  SEARCH_PATH,
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
  .filter(({ action }) => action.route.pattern === `${SEARCH_PATH}`);

export const searchWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === `${SEARCH_PATH}`);
