import {
  main$,
  routeWillEnter$,
  routeDidEnter$,
  routeDidLeave$,
} from '@shopgate/pwa-common/streams';
import {
  CATEGORY_PATH,
  RECEIVE_ROOT_CATEGORIES,
  ERROR_CATEGORY,
} from '../constants';
import { FILTER_PATH } from '../../filter/constants';

export const categoryWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

export const categoryDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

export const categoryDidLeave$ = routeDidLeave$
  .filter(({ action }) => action.route.pattern === `${CATEGORY_PATH}/:categoryId`);

/**
 * Gets triggered when leaving a category route.
 * When opening the filter page the categoryId should be preserved
 * so that the filters know what category needs to be filtered.
 */
export const categoryRouteDidLeave$ = routeDidLeave$
  .filter(({ action }) => (
    action.route.pattern === CATEGORY_PATH
    || action.route.pattern === `${CATEGORY_PATH}/:categoryId`
  ))
  .zip(routeDidEnter$.filter(({ action }) => (
    action.route.pattern !== `${CATEGORY_PATH}/:categoryId${FILTER_PATH}`
  )));

/**
 * Gets triggered when entering a category route.
 */
export const categoryRouteDidEnter$ = routeDidEnter$
  .filter(({ action }) => (
    action.route.pattern === CATEGORY_PATH
    || action.route.pattern === `${CATEGORY_PATH}/:categoryId`
  ));

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
