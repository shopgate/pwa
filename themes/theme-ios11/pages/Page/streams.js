import { getCurrentRoute } from '@shopgate/engage/core';
import { routeWillEnter$ } from '@shopgate/engage/core';
import { main$ } from '@shopgate/engage/core';
import { RECEIVE_PAGE_CONFIG } from '@shopgate/engage/core';

export const pageWillEnter$ = routeWillEnter$
  .filter(({ action }) => !!action.route.params.pageId);

export const receivedVisiblePageConfig$ = main$
  .filter(({ action, getState }) => {
    const route = getCurrentRoute(getState());

    if (action.type !== RECEIVE_PAGE_CONFIG) {
      return false;
    }

    if (typeof action.pageId === 'undefined') {
      return false;
    }

    if (!route.params.pageId) {
      return false;
    }

    return action.pageId === route.params.pageId;
  });
