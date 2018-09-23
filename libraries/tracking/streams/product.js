import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { HISTORY_REPLACE_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { getBaseProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { receivedVisibleProduct$ } from '@shopgate/pwa-common-commerce/product/streams';
import {
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCTS,
  ITEM_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { pwaDidAppear$ } from './app';

/**
 * Emits when product results has been received.
 */
export const productsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCTS);

/**
 * Emits when product result has been received.
 */
export const productReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT);

/**
 * Emits when the category route comes active again after a legacy page was active.
 */
export const productRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => action.route.pattern === ITEM_PATTERN);

/**
 * Emits when a product page was initially opened.
 */
export const productWillEnter$ = routeWillEnter$.filter(({ action }) =>
  action.route.pattern === ITEM_PATTERN &&
  action.historyAction !== HISTORY_REPLACE_ACTION);

/**
 * Emits when a product page was updated due to a variant product switch.
 */
export const productWillUpdate$ = routeWillEnter$.filter(({ action }) =>
  action.route.pattern === ITEM_PATTERN &&
  action.historyAction === HISTORY_REPLACE_ACTION);

/**
 * Emits when a product page was initially opened and its data is present.
 */
export const productIsReady$ = productWillEnter$
  .zip(receivedVisibleProduct$)
  .map(([, received]) => received)
  .merge(productRouteReappeared$);

/**
 * Emits when a variant product was changed.
 */
export const variantDidChange$ = productWillUpdate$
  .zip(receivedVisibleProduct$)
  .map(([, received]) => received)
  .switchMap((data) => {
    const { id, baseProductId } = data.action.productData;

    const variantId = baseProductId !== null ? id : null;
    const baseProduct = getBaseProduct(data.getState(), { variantId });

    if (baseProduct === null) {
      /**
       * A PDP with a variant product was opened, but the base product is not fetched yet.
       * So emitting of the stream is postponed till the data is present.
       */
      return productReceived$;
    }

    return Observable.of(data);
  });
