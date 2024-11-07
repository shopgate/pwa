import {
  main$,
  routeWillEnter$,
  routeDidEnter$,
  routeDidLeave$,
  routeWillLeave$,
} from '@shopgate/pwa-common/streams';
import { routeDidUpdate$ } from '@shopgate/pwa-common/streams/router';
import { HISTORY_POP_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
import { filtersDidUpdate$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { filterWillLeave$ } from '../../filter/streams';
import {
  CATEGORY_PATTERN,
  CATEGORY_ALL_PATTERN,
  RECEIVE_ROOT_CATEGORIES,
  ERROR_CATEGORY,
  RECEIVE_CATEGORY,
  CATEGORY_PATH,
} from '../constants';

export const categoryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === CATEGORY_PATTERN);

export const categoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === CATEGORY_PATTERN);

export const categoryDidLeave$ = routeDidLeave$
  .filter(({ action }) => action.route.pattern === CATEGORY_PATTERN);

export const categoryAllWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === CATEGORY_ALL_PATTERN);

export const categoryAllDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === CATEGORY_ALL_PATTERN);

export const categoryAllDidLeave$ = routeDidLeave$
  .filter(({ action }) => action.route.pattern === CATEGORY_ALL_PATTERN);

/**
 * Gets triggered when the root categories received.
 */
export const receivedRootCategories$ = main$.filter(({ action }) => (
  action.type === RECEIVE_ROOT_CATEGORIES
));

/**
 * Gets trigger when category error is dispatched.
 */
export const categoryError$ = main$.filter(({ action }) => (action.type === ERROR_CATEGORY));

export const categoryDidBackEnter$ = categoryDidEnter$.filter(
  ({ action }) => action.historyAction === HISTORY_POP_ACTION
);

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
    return (pattern === CATEGORY_PATTERN);
  });

export const categoryDidUpdate$ = routeDidUpdate$
  .filter(({ action }) => action?.route?.pattern === CATEGORY_PATTERN);

export const categoryAllDidUpdate$ = routeDidUpdate$
  .filter(({ action }) => action?.route?.pattern === CATEGORY_ALL_PATTERN);

export const categoryFiltersDidUpdateFromFilterPage$ = categoryDidUpdate$
  .switchMap(() => filterWillLeave$.first())
  .switchMap(() => categoryWillEnter$.first());

export const categoryAllFiltersDidUpdateFromFilterPage$ = categoryAllDidUpdate$
  .switchMap(() => filterWillLeave$.first())
  .switchMap(() => categoryAllWillEnter$.first());
