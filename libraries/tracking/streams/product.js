import 'rxjs/add/operator/switchMap';
import {
  main$,
  routeWillEnter$,
  pwaDidAppear$,
} from '@shopgate/engage/core/streams';
import { getIsAppWebViewVisible } from '@shopgate/engage/core/selectors';
import { receivedVisibleProduct$ } from '@shopgate/pwa-common-commerce/product/streams';
import {
  RECEIVE_PRODUCTS,
  ITEM_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';

/**
 * Emits when product results has been received.
 */
export const productsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCTS);

/**
 * Emits when the category route comes active again after a legacy page was active.
 */
export const productRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => action.route.pattern === ITEM_PATTERN);

/**
 * Emits when a product page was initially opened.
 */
export const productWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === ITEM_PATTERN);

/**
 * Emits when a product page was initially opened and its data is present.
 */
export const productIsReady$ = productWillEnter$
  // Do not track while PWA webview is in the background
  .filter(({ getState }) => getIsAppWebViewVisible(getState()))
  // Take care that the stream only emits when underlying streams emit within the correct order.
  .switchMap(() => receivedVisibleProduct$.first())
  .merge(productRouteReappeared$);
