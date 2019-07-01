import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import {
  appWillStart$,
  pwaDidAppear$,
  pwaDidDisappear$,
} from '@shopgate/pwa-common/streams/app';
import { APP_WILL_START, PWA_DID_APPEAR } from '@shopgate/pwa-common/constants/ActionTypes';
import {
  SEARCH_PATH,
  SEARCH_FILTER_PATTERN,
} from '@shopgate/pwa-common-commerce/search/constants';
import {
  ROOT_CATEGORY_PATTERN,
  CATEGORY_PATTERN,
  CATEGORY_FILTER_PATTERN,
} from '@shopgate/pwa-common-commerce/category/constants';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { pwaVisibility$ } from './app';
import { checkoutDidEnter$ } from './checkout';

/**
 * A blacklist of paths that should be tracked within their individual subscriptions.
 * @type {Array}
 */
export const blacklistedPatterns = [
  ROOT_CATEGORY_PATTERN,
  CATEGORY_PATTERN,
  ITEM_PATTERN,
  FAVORITES_PATH,
  SEARCH_PATH,
  // Patterns for routes which are not supported for tracking at the moment.
  CATEGORY_FILTER_PATTERN,
  SEARCH_FILTER_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
];

const latestAppActions$ = appWillStart$.merge(pwaVisibility$, checkoutDidEnter$);

/**
 * Route did enter and PWA is visible and route is not blacklisted
 * @type {Rx.Observable<*[]>}
 */
const routeDidEnterForVisiblePwa$ = routeDidEnter$
  .withLatestFrom(latestAppActions$)
  .filter(([, { action: { type } }]) => type === APP_WILL_START || type === PWA_DID_APPEAR)
  .map(([routeDidEnter]) => routeDidEnter);

/**
 * PWA reappear after disappear
 * @type {Rx.Observable<any>}
 */
const pwaDidAppearAfterDisappear = pwaDidDisappear$.switchMap(() => pwaDidAppear$.first());

/**
 * Emits when one of the tracked paths is entered or pwa reappear
 */
export const pagesAreReady$ = routeDidEnterForVisiblePwa$
  .merge(pwaDidAppearAfterDisappear)
  .filter(({ action }) => !blacklistedPatterns.find(pattern => action.route.pattern === pattern));
