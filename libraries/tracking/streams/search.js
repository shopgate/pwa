import 'rxjs/add/operator/switchMap';
import {
  SEARCH_PATH,
  RECEIVE_SEARCH_RESULTS,
} from '@shopgate/pwa-common-commerce/search/constants';
import { searchDidEnter$ } from '@shopgate/pwa-common-commerce/search/streams';
import { routeDidLeave$ } from '@shopgate/pwa-common/streams';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { pwaDidAppear$ } from './app';

/**
 * Emits when the search route is active.
 */
const searchIsActive$ = searchDidEnter$
  .zip(routeDidLeave$.filter(({ action }) => action.route.pattern !== SEARCH_PATH));

/**
 * Emits when the search route comes active again after a legacy page was active.
 */
const searchRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => action.route.pattern === SEARCH_PATH);

/**
 * Emits when search results are received.
 */
const resultsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_SEARCH_RESULTS);

/**
 * Emits when the search is ready to be tracked and all relevant data is available.
 */
export const searchIsReady$ = searchIsActive$
  .switchMap(() => resultsReceived$.first())
  .merge(searchRouteReappeared$);
