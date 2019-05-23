import { routeWillEnter$, INDEX_PATH } from '@shopgate/engage/core';

export const startPageWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pathname === INDEX_PATH);
