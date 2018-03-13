/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { OPEN_LINK, UPDATE_HISTORY } from '../constants/ActionTypes';
import { getHistoryPathname, getHistoryAction } from '../selectors/history';
import { REGISTER_PATH } from '../constants/RoutePaths';
import { main$ } from './main';

/**
 * Gets triggered when the history is updated.
 * @type {Observable}
 */
export const historyDidUpdate$ = main$
  .filter(({ action }) => action.type === UPDATE_HISTORY);

/**
 * Gets triggered when the route changes.
 * @type {Observable}
 */
export const routeDidChange$ = historyDidUpdate$
  .filter(({ getState, prevState }) => (
    /**
     * When the current and previous histories have a length of 1 then we know that
     * this is the first time that any route enters.
     */
    (getState().history.length === 1 && prevState.history.length === 1) ||
    (getHistoryPathname(getState()) !== getHistoryPathname(prevState))
  ))
  .map(input => ({
    ...input,
    initialEnter: (input.getState().history.length === 1 && input.prevState.history.length === 1),
    pathname: getHistoryPathname(input.getState()),
    prevPathname: getHistoryPathname(input.prevState),
    historyAction: getHistoryAction(input.getState()),
  }));

/**
 * Gets triggered when a route has entered.
 * @param {string} route The route path.
 * @type {Function}
 * @return {Observable}
 */
export const routeDidEnter = route => routeDidChange$
  .filter(({ initialEnter, pathname, prevPathname }) => {
    // Check if both path names start with the watched route.
    const pathnameMatch = pathname.startsWith(route);
    const prevPathnameMatch = prevPathname.startsWith(route);

    // Check if the previous path doesn't contain the route, but the next one does.
    const routeChanged = (initialEnter && pathnameMatch) || (!prevPathnameMatch && pathnameMatch);

    // The route was entered, if there was a change between routes, or within the watched one.
    return routeChanged || (pathnameMatch && prevPathnameMatch && pathname !== prevPathname);
  });

/**
 * Gets triggered when a route has left.
 * @param {string} route The route path.
 * @type {Function}
 * @return {Observable}
 */
export const routeDidLeave = route => routeDidChange$
  .filter(({ pathname, prevPathname }) => {
    // Check if both path names start with the watched route.
    const pathnameMatch = pathname.startsWith(route);
    const prevPathnameMatch = prevPathname.startsWith(route);

    // Check if the previous path contains the route, but the next one doesn't.
    const routeChanged = prevPathnameMatch && !pathnameMatch;

    // The route was left, if there was a change between routes, or within the watched one.
    return routeChanged || (pathnameMatch && prevPathnameMatch && pathname !== prevPathname);
  });

/**
 * Gets triggered, when the history was updated, but the route didn't change.
 * @param {string} route The route path.
 * @type {Function}
 * @return {Observable}
 */
export const routeDidNotChange = route => historyDidUpdate$
  .filter(({ getState }) => getHistoryPathname(getState()).startsWith(route));

/**
 * Gets triggered when a link is opened.
 * @type {Observable}
 */
export const openedLink$ = main$
  .filter(({ action }) => action.type === OPEN_LINK);

/**
 * Gets triggered when the registration link is opened.
 * @type {Observable}
 */
export const openedRegisterLink$ = openedLink$
  .filter(({ action }) =>
    action.options &&
    action.options.url &&
    action.options.url === REGISTER_PATH);
