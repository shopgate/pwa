import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';

export const writeReviewRouteWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === '/item/:productId/write_review');

export const reviewsRouteWillEnter$ = routeWillEnter$
  .filter(({ action }) => (
    action.route.pattern === '/item/:productId/reviews' ||
    action.route.pattern === '/item/:productId/write_review'
  ));
