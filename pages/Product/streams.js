import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';

export const productWillEnter$ = routeWillEnter$
  .filter(({ action }) => (
    action.route.pattern === `${ITEM_PATH}/:productId` &&
    !action.route.pathname.includes('/reviews') &&
    !action.route.pathname.includes('/write_review')
  ));

export const writeReviewRouteDidEnter$ = routeDidEnter(ITEM_PATH)
  .filter(({ pathname }) => (
    pathname.endsWith('write_review') || pathname.endsWith('write_review/')
  ));

export const reviewsRouteDidEnter$ = routeDidEnter(ITEM_PATH)
  .filter(({ pathname }) => (
    pathname.endsWith('reviews') || pathname.endsWith('reviews/')
  ));
