import { routeWillEnter$, routeWillLeave$ } from '@shopgate/pwa-common/streams/router';
import { CATEGORY_PATH } from '../../category/constants';

export const filterWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId/filter`);

export const filterWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId/filter`);

