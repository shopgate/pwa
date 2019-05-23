import { routeWillEnter$ } from '@shopgate/engage/core';
import { INDEX_PATH } from '@shopgate/engage/core';

export const startPageWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pathname === INDEX_PATH);
