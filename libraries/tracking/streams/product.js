import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { receivedVisibleProduct$ } from '@shopgate/pwa-common-commerce/product/streams';
import {
  ITEM_PATH,
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCTS,
} from '@shopgate/pwa-common-commerce/product/constants';
import { HISTORY_PUSH_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
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
const productRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => action.route.pattern === `${ITEM_PATH}/:productId`);

export const productDidEnter$ = routeDidEnter$.filter(({ action }) =>
  action.route.pattern === `${ITEM_PATH}/:productId` &&
  action.historyAction === HISTORY_PUSH_ACTION);

/**
 * Emits when all necessary product data is present.
 */
export const productIsReady$ = productDidEnter$
  .zip(receivedVisibleProduct$)
  .map(([, second]) => second)
  .switchMap((data) => {
    const { id, baseProductId } = data.action.productData;

    const productId = baseProductId !== null ? baseProductId : id;
    const variantId = baseProductId !== null ? id : null;

    const product = getProduct(data.getState(), { productId });

    if (variantId && product === null) {
      /**
       * A PDP with a variant product was opened, but the base product is not fetched yet.
       * So emitting of the stream is postponed till the data is present.
       */
      return productReceived$;
    }

    return Observable.of(data);
  });
