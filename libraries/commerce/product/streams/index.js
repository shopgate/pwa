import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { ENOTFOUND } from '@shopgate/pwa-core';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeWillEnter$, routeWillLeave$, routeDidUpdate$ } from '@shopgate/pwa-common/streams/router';
import { pwaDidAppear$ } from '@shopgate/pwa-common/streams';
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
  RECEIVE_PRODUCTS_CACHED,
  RECEIVE_PRODUCTS,
  PROVIDE_PRODUCT_BUFFER_TIME,
  PROVIDE_PRODUCT,
  EXPIRE_PRODUCT_DATA,
  REFRESH_EXPIRED_PDP_DATA,
} from '../constants';

/**
 * Emits when the category route comes active again after a legacy page was active.
 */
export const productRouteReappeared$ = pwaDidAppear$
  .filter(({ action }) => action.route.pattern === ITEM_PATTERN);

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

/**
 * Emits when a product page was initially opened and its data is present.
 */
export const productIsReady$ = productWillEnter$
  // Take care that the stream only emits when underlying streams emit within the correct order.
  .switchMap(() => receivedVisibleProduct$.first())
  .merge(productRouteReappeared$);

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

/**
 * Emits when product results has been received.
 */
export const productsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCTS);

/**
 * Emits when product results has been received from cache.
 */
export const productsReceivedCached$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCTS_CACHED);

/**
 * Buffer PROVIDE_PRODUCT action and map to have array of requested products
 * @type {Observable}
 */
export const fetchProductsRequested$ = main$
  .filter(({ action }) => action.type === PROVIDE_PRODUCT)
  .bufferTime(PROVIDE_PRODUCT_BUFFER_TIME)
  .filter(actions => actions.length > 0)
  .map((actions) => {
    const productIds = actions.map(({ action: { productId } }) => productId);
    return {
      ...actions[0],
      action: {
        ...actions[0].action,
        productId: productIds,
      },
    };
  });

/**
 * Emits when product data has been expired.
 */
export const productDataExpired$ = main$
  .filter(({ action }) => action.type === EXPIRE_PRODUCT_DATA);

/**
 * Emits when the REFRESH_EXPIRED_PDP_DATA action is dispatched
 * and the current route is a product detail page.
 *
 * Stream payload will contain a route object that reflects the current active product / variant.
 */
export const pdpDataNeedsRefresh$ = main$
  .filter(({ action }) => action.type === REFRESH_EXPIRED_PDP_DATA)
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return pattern === ITEM_PATTERN;
  }).switchMap((params) => {
    const { getState } = params;
    const route = getCurrentRoute(getState());
    return Observable.of({
      ...params,
      action: {
        route,
      },
    });
  });
