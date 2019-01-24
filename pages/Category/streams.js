import { main$ } from '@shopgate/pwa-common/streams/main';
import { routeWillEnter$, routeDidEnter$, routeWillLeave$ } from '@shopgate/pwa-common/streams/router';
import { CATEGORY_PATH, RECEIVE_CATEGORY } from '@shopgate/pwa-common-commerce/category/constants';
import { filtersDidUpdate$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';

export const categoryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

export const categoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

export const categoryWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

export const receivedVisibleCategory$ = main$
  .filter(({ action, getState }) => {
    const route = getCurrentRoute(getState());

    if (action.type !== RECEIVE_CATEGORY) {
      return false;
    }

    if (typeof action.categoryId === 'undefined') {
      return false;
    }

    if (!route.params.categoryId) {
      return false;
    }

    return action.categoryId === hex2bin(route.params.categoryId);
  });

export const categoryFiltersDidUpdate$ = filtersDidUpdate$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === `${CATEGORY_PATH}/:categoryId`);
  });
