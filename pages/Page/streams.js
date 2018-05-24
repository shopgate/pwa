import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { INDEX_PATH, PAGE_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

export const pageDidEnter$ = routeDidEnter$
  .filter(({ action }) => (
    action.route.pathname === INDEX_PATH ||
    action.route.pathname.startsWith(PAGE_PATH)
  ));
