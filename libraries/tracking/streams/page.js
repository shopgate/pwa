import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { RECEIVE_PAGE_CONFIG } from '@shopgate/engage/core/constants';
import {
  main$,
  routeDidEnter$,
  pwaDidAppear$,
} from '@shopgate/engage/core/streams';
import {
  getIsAppWebViewVisible,
} from '@shopgate/engage/core/selectors';
import { PAGE_PATTERN, RECEIVE_PAGE_CONFIG_V2 } from '@shopgate/engage/page/constants';
import { makeGetUnifiedCMSPageData } from '@shopgate/engage/page/selectors';

/**
 * Emits when a "page" was entered.
 */
const pageDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === PAGE_PATTERN);

/**
 * Emits when the page route comes active again after a legacy page was active.
 */
const pageRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => action.route.pattern === PAGE_PATTERN);

const pageConfigReceived$ = main$
  .filter(({ action }) => [RECEIVE_PAGE_CONFIG, RECEIVE_PAGE_CONFIG_V2].includes(action.type));

/**
 * Emits when a "page" was opened, and its config is available.
 */
export const pageIsReady$ = pageDidEnter$
  // Do not track while PWA webview is in the background
  .filter(({ getState }) => getIsAppWebViewVisible(getState()))
  .switchMap((data) => {
    const { action, getState } = data;
    const { pageId } = action.route.params;

    // Check if the page config for the current route is already available within Redux.
    const pageConfig = makeGetUnifiedCMSPageData({ slug: pageId })(getState());

    if (!pageConfig || pageConfig.isFetching) {
      // Wait for incoming page data if it's not available yet.
      return pageConfigReceived$.first().switchMap(() => Observable.of(data));
    }

    return Observable.of(data);
  }).merge(pageRouteReappeared$);
