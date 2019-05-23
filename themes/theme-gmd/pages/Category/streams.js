import { main$ } from '@shopgate/engage/core';
import {
  routeWillEnter$,
  routeDidEnter$,
  routeWillLeave$,
  getCurrentRoute,
  hex2bin,
} from '@shopgate/engage/core';
import { CATEGORY_PATH, RECEIVE_CATEGORY, ERROR_CATEGORY } from '@shopgate/engage/category';
import { filtersDidUpdate$ } from '@shopgate/engage/filter';

export const categoryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

export const categoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

export const categoryWillLeave$ = routeWillLeave$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

/**
 * Filters stream state by type.
 * @param {Object} data The stream data.
 * @param {string} type The action type to filter.
 * @returns {boolean}
 */
const filterDataByType = (data, type) => {
  const { action, getState } = data;

  if (action.type !== type) {
    return false;
  }

  if (typeof action.categoryId === 'undefined') {
    return false;
  }

  const route = getCurrentRoute(getState());

  if (!route.params.categoryId) {
    return false;
  }

  return action.categoryId === hex2bin(route.params.categoryId);
};

export const receivedVisibleCategory$ = main$
  .filter(data => filterDataByType(data, RECEIVE_CATEGORY));

export const errorVisibleCategory$ = main$
  .filter(data => filterDataByType(data, ERROR_CATEGORY));

export const categoryFiltersDidUpdate$ = filtersDidUpdate$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === `${CATEGORY_PATH}/:categoryId`);
  });
