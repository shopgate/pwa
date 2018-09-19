import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeWillEnter$, routeWillLeave$ } from '@shopgate/pwa-common/streams/router';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { ITEM_PATH, RECEIVE_PRODUCT, RECEIVE_PRODUCT_CACHED } from '../constants';

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
