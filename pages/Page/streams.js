import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';

export const pageWillEnter$ = routeWillEnter$
  .filter(({ action }) => !!action.route.params.pageId);
