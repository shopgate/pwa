import { routeWillEnter$, routeWillLeave$ } from '@shopgate/engage/core';
import { LOGIN_PATH } from '@shopgate/engage/user';

export const loginWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === LOGIN_PATH);

export const loginWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === LOGIN_PATH);
