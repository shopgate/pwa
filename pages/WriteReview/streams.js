import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';

export const reviewsRoutesWillEnter$ = routeWillEnter$
  .filter(({ action }) => (
    action.route.pattern === '/item/:productId' ||
    action.route.pattern === '/item/:productId/reviews' ||
    action.route.pattern === '/item/:productId/write_review'
  ));
