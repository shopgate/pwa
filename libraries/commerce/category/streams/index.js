import {
  main$,
  routeWillEnter$,
  routeDidEnter$,
  routeDidLeave$,
} from '@shopgate/pwa-common/streams';
import {
  CATEGORY_PATTERN,
  RECEIVE_ROOT_CATEGORIES,
  ERROR_CATEGORY,
} from '../constants';

export const categoryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === CATEGORY_PATTERN);

export const categoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === CATEGORY_PATTERN);

export const categoryDidLeave$ = routeDidLeave$
  .filter(({ action }) => action.route.pattern === CATEGORY_PATTERN);

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
