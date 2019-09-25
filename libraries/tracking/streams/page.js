import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { RECEIVE_PAGE_CONFIG } from '@shopgate/pwa-common/constants/ActionTypes';
import { main$, routeDidEnter$, pwaDidAppear$ } from '@shopgate/engage/core';
import { PAGE_PATTERN, getPageConfigById } from '@shopgate/engage/page';

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
  .filter(({ action }) => action.type === RECEIVE_PAGE_CONFIG);

/**
 * Emits when a "page" was opened, and its config is available.
 */
export const pageIsReady$ = pageDidEnter$
  .switchMap((data) => {
    const { action, getState } = data;
    const { pageId } = action.route.params;

    // Check if the page config for the current route is already available within Redux.
    const pageConfig = getPageConfigById(getState(), { pageId });

    if (!pageConfig || pageConfig.isFetching) {
      // Wait for incoming page data if it's not available yet.
      return pageConfigReceived$.first().switchMap(() => Observable.of(data));
    }

    return Observable.of(data);
  }).merge(pageRouteReappeared$);
