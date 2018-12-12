import { main$ } from '@shopgate/pwa-common/streams/main';
import { ACTION_PUSH, ACTION_POP } from '@virtuous/conductor';
import {
  routeWillEnter$,
  routeDidEnter$,
  routeWillLeave$,
  routeDidLeave$,
} from '@shopgate/pwa-common/streams';
import { CATEGORY_PATH } from '../../category/constants';
import { SEARCH_PATH } from '../../search/constants';
import { FILTER_PATH, UPDATE_FILTERS } from '../constants';

export const filterWillEnter$ = routeWillEnter$
  .filter(({ action }) => (
    action.route.pattern === `${CATEGORY_PATH}/:categoryId${FILTER_PATH}`
    || action.route.pattern === `${SEARCH_PATH}${FILTER_PATH}`
  ));

export const filterDidEnter$ = routeDidEnter$
  .filter(({ action }) => (
    action.route.pattern === `${CATEGORY_PATH}/:categoryId${FILTER_PATH}`
    || action.route.pattern === `${SEARCH_PATH}${FILTER_PATH}`
  ));

export const filterWillLeave$ = routeWillLeave$
  .filter(({ action }) => (
    action.route.pattern === `${CATEGORY_PATH}/:categoryId${FILTER_PATH}`
    || action.route.pattern === `${SEARCH_PATH}${FILTER_PATH}`
  ));

export const filterDidLeave$ = routeDidLeave$
  .filter(({ action }) => (
    action.route.pattern === `${CATEGORY_PATH}/:categoryId${FILTER_PATH}`
    || action.route.pattern === `${SEARCH_PATH}${FILTER_PATH}`
  ));

export const filterableRoutesWillEnter$ = routeWillEnter$
  .filter(({ action }) => (
    action.historyAction === ACTION_PUSH
    && (
      action.route.pattern === `${CATEGORY_PATH}/:categoryId`
      || action.route.pattern === SEARCH_PATH
    )
  ));

export const filterableRoutesWillReenter$ = routeWillEnter$
  .filter(({ action }) => (
    action.historyAction === ACTION_POP
    && (
      action.route.pattern === `${CATEGORY_PATH}/:categoryId`
      || action.route.pattern === SEARCH_PATH
    )
  ));

export const filterableRoutesWillLeave$ = routeWillLeave$
  .filter(({ action }) => (
    action.historyAction === ACTION_POP
    && (
      action.route.pattern === `${CATEGORY_PATH}/:categoryId`
      || action.route.pattern === SEARCH_PATH
    )
  ));

export const attributeWillEnter$ = routeWillEnter$
  .filter(({ action }) => (
    action.route.pattern === `${CATEGORY_PATH}/:categoryId${FILTER_PATH}/:attribute`
    || action.route.pattern === `${SEARCH_PATH}${FILTER_PATH}/:attribute`
  ));

export const filtersDidUpdate$ = main$
  .filter(({ action }) => action.type === UPDATE_FILTERS);
