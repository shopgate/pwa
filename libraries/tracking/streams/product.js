import 'rxjs/add/operator/switchMap';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { pwaDidAppear$ } from '@shopgate/pwa-common/streams/app';
import {
  RECEIVE_PRODUCTS,
  ITEM_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';

export { productIsReady$ } from '@shopgate/engage/product';

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
