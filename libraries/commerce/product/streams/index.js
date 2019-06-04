import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { ENOTFOUND } from '@shopgate/pwa-core';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeWillEnter$, routeWillLeave$, routeDidUpdate$ } from '@shopgate/pwa-common/streams/router';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { getBaseProduct } from '../selectors/product';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCT_CACHED,
  RECEIVE_PRODUCT_RELATIONS,
  ERROR_PRODUCT,
  ERROR_PRODUCT_DESCRIPTION,
  ERROR_PRODUCT_IMAGES,
  ERROR_PRODUCT_VARIANTS,
  ERROR_PRODUCT_PROPERTIES,
  ERROR_PRODUCT_OPTIONS,
  ERROR_PRODUCT_SHIPPING,
  PRODUCT_NOT_AVAILABLE,
} from '../constants';

export const productWillEnter$ = routeWillEnter$.merge(routeDidUpdate$)
  .filter(({ action }) => action.route.pattern === ITEM_PATTERN);

export const variantWillUpdate$ = routeDidUpdate$
  .filter(({ action }) => action.route.pattern === ITEM_PATTERN);

export const galleryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === ITEM_GALLERY_PATTERN);

export const galleryWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === ITEM_GALLERY_PATTERN);

export const productReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT)
  .distinctUntilChanged();

/** Dispatched when ERROR_PRODUCT received */
export const errorProduct$ = main$.filter(({ action }) => action.type === ERROR_PRODUCT);

/** Dispatched when ERROR_PRODUCT_* (resources) is received */
export const errorProductResources$ = main$.filter((
  ({ action }) => [
    ERROR_PRODUCT_DESCRIPTION,
    ERROR_PRODUCT_IMAGES,
    ERROR_PRODUCT_VARIANTS,
    ERROR_PRODUCT_PROPERTIES,
    ERROR_PRODUCT_OPTIONS,
    ERROR_PRODUCT_SHIPPING,
  ].includes(action.type)
));

/** Dispatched when ERROR_PRODUCT ENOTFOUND received */
export const errorProductNotFound$ = errorProduct$.filter((
  ({ action }) => action.errorCode === ENOTFOUND
));

/** Dispatched when ERROR_PRODUCT_* ENOTFOUND received */
export const errorProductResourcesNotFound$ = errorProductResources$.filter((
  ({ action }) => action.errorCode === ENOTFOUND
));

export const cachedProductReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT_CACHED)
  .distinctUntilChanged();

export const receivedVisibleProduct$ = productReceived$.merge(cachedProductReceived$)
  .filter(({ action, getState }) => {
    const route = getCurrentRoute(getState());

    if (typeof action.productData === 'undefined' || typeof action.productData.id === 'undefined') {
      return false;
    }

    if (!route.params.productId && !route.state.productId) {
      return false;
    }

    if (route.state.productId) {
      return action.productData.id === route.state.productId;
    }

    return action.productData.id === hex2bin(route.params.productId);
  });

/** Dispatched when ERROR_PRODUCT ENOTFOUND of visible product is received */
export const visibleProductNotFound$ = errorProductNotFound$
  .withLatestFrom(routeWillEnter$)
  .filter(([errorAction, routeAction]) => (
    routeAction.action.route.pattern === ITEM_PATTERN
      && errorAction.action.productId === hex2bin(routeAction.action.route.params.productId)
  ))
  .map(([errorAction]) => errorAction);

export const variantDidChange$ = variantWillUpdate$
  // Take care that the stream only emits when underlying streams emit within the correct order.
  .switchMap(() =>
    receivedVisibleProduct$.first()
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
      }));

export const productRelationsReceived$ =
  main$.filter(({ action }) => action.type === RECEIVE_PRODUCT_RELATIONS);

export const productNotAvailable$ =
  main$.filter(({ action }) => action.type === PRODUCT_NOT_AVAILABLE);
