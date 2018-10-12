import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { main$ } from '@shopgate/pwa-common/streams/main';
import { RECEIVE_PAGE_CONFIG } from '@shopgate/pwa-common/constants/ActionTypes';

export const pageWillEnter$ = routeWillEnter$
  .filter(({ action }) => !!action.route.params.pageId);

export const receivedVisiblePageConfig$ = main$
  .filter(({ action }) => {
    const route = getCurrentRoute();

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
