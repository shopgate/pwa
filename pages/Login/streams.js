import { routeWillEnter$, routeWillLeave$ } from '@shopgate/pwa-common/streams/router';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

export const loginWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === LOGIN_PATH);

export const loginWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === LOGIN_PATH);
