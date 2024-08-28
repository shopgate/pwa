import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import {
  main$,
  pwaDidAppear$,
} from '@shopgate/engage/core/streams';
import {
  getIsAppWebViewVisible,
  getCurrentSearchQuery,
} from '@shopgate/engage/core/selectors';
import {
  SEARCH_PATTERN,
  RECEIVE_SEARCH_RESULTS,
} from '@shopgate/engage/search/constants';
import {
  searchDidEnter$,
} from '@shopgate/engage/search/streams';

/**
 * Emits when the search route comes active again after a legacy page was active.
 */
const searchRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => action.route.pattern === SEARCH_PATTERN);

/**
 * Emits when search results are received.
 */
const resultsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_SEARCH_RESULTS);

/**
 * Emits when the search is ready to be tracked and all relevant data is available.
 */
export const searchIsReady$ = searchDidEnter$
  // Do not track while PWA webview is in the background
  .filter(({ getState }) => getIsAppWebViewVisible(getState()))
  .switchMap((data) => {
    const { getState } = data;
    const query = getCurrentSearchQuery(getState());

    // Check if products for the current route are already available within Redux.
    const productsLoaded = getProductsResult(
      getState(),
      { searchPhrase: query }
    ).totalProductCount !== null;

    if (!productsLoaded) {
      // Wait for incoming products if they are not available yet.
      return resultsReceived$.first();
    }

    return Observable.of(data);
  })
  .merge(searchRouteReappeared$);
