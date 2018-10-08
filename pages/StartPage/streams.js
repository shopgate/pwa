import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

export const startPageWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pathname === INDEX_PATH);
