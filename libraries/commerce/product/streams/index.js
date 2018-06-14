import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeWillEnter$, routeWillLeave$ } from '@shopgate/pwa-common/streams/router';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import {
  ITEM_PATH,
  RECEIVE_PRODUCT,
  RECEIVE_PRODUCT_CACHED,
  SET_PRODUCT_VARIANT_ID,
} from '../constants';
import { getSelectedVariant } from '../selectors/variants';

export const productWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === `${ITEM_PATH}/:productId`);

export const galleryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === `${ITEM_PATH}/:productId/gallery/:slide`);

export const galleryWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === `${ITEM_PATH}/:productId/gallery/:slide`);

export const productReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT)
  .distinctUntilChanged();

export const cachedProductReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT_CACHED)
  .distinctUntilChanged();

export const receivedVisibleProduct$ = productReceived$.merge(cachedProductReceived$)
  .filter(({ action }) => {
    const route = getCurrentRoute();

    if (
      typeof action.productData === 'undefined'
      || typeof action.productData.id === 'undefined'
    ) {
      return false;
    }

    if (!route.params.productId) {
      return false;
    }

    return action.productData.id === hex2bin(route.params.productId);
  });

/**
 * Gets triggered when VariantId changes.
 * @type {Observable}
 */
const setVariantId$ = main$.filter(({ action }) => (
  action.type === SET_PRODUCT_VARIANT_ID &&
  action.productVariantId !== null
));

/**
 * Gets triggered when VariantId changes and product data received for this variant.
 * @type {Observable}
 */
export const variantDidChangeUncached$ = setVariantId$
  .switchMap(({ action }) => (
    productReceived$.filter(({ action: productAction }) => (
      productAction.productId === action.productVariantId
    ))
  ));

/**
 * Gets triggered when VariantId changes and product data is already there.
 * @type {Observable}
 */
const variantDidChangedCached = setVariantId$
  .filter(({ getState }) => !!getSelectedVariant(getState()));

/**
 * Gets triggered when VariantId changes and product data is available.
 * @type {Observable}
 */
export const variantDidChange$ = variantDidChangeUncached$.merge(variantDidChangedCached);
