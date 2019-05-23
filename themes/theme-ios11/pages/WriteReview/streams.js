import { routeWillEnter$ } from '@shopgate/engage/core';

export const productRoutesWillEnter$ = routeWillEnter$
  .filter(({ action }) => (
    action.route.pattern === '/item/:productId' ||
    action.route.pattern === '/item/:productId/reviews' ||
    action.route.pattern === '/item/:productId/write_review'
  ));

export const reviewsRouteWillEnter$ = routeWillEnter$
  .filter(({ action }) => (
    action.route.pattern === '/item/:productId/reviews' ||
    action.route.pattern === '/item/:productId/write_review'
  ));
