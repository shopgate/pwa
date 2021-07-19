import 'rxjs/add/operator/switchMap';
import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { pwaDidAppear$ } from '@shopgate/pwa-common/streams/app';
import { receivedVisibleProduct$, productsReceived$ } from '@shopgate/pwa-common-commerce/product/streams';
import {
  ITEM_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';

export { productsReceived$ };

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
  // Take care that the stream only emits when underlying streams emit within the correct order.
  .switchMap(() => receivedVisibleProduct$.first())
  .merge(productRouteReappeared$);
