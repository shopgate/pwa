import { createSelector } from 'reselect';
import {
  getCurrentPathname,
  getCurrentQuery,
  getRouterStack,
} from './router';
import { parseObjectToQueryString } from '../helpers/router';
import { DEFAULT_SORT } from '../constants/DisplayOptions';

/**
 * Selects the history state.
 * @param {Object} state The global state.
 * @deprecated
 * @return {Object}
 */
export const getHistoryState = state => state.history;

/**
 * Retrieves a single url parameter from the query parameters object.
 * @param {Object} state The global state.
 * @param {string} param The dedicated url parameter.
 * @return {*} The URL parameter value.
 */
export const getQueryParam = createSelector(
  getCurrentQuery,
  (state, props, param) => param,
  (params, param) => {
    if (!params || !params[param]) {
      return null;
    }

    return params[param];
  }
);

/**
 * Retrieves the sort order from the URL query parameters.
 * @param {Object} state The global state.
 * @returns {string} The current sort order.
 */
export const getSortOrder = createSelector(
  (state, props) => getQueryParam(state, props, 'sort'),
  param => param || DEFAULT_SORT
);

/**
 * Retrieves the search phrase from the URL query parameters.
 * @param {Object} state The global state.
 * @returns {string|null} The current search phrase.
 */
export const getSearchPhrase = createSelector(
  (state, props) => getQueryParam(state, props, 's'),
  param => (param ? param.trim() : null)
);

/**
 * Gets the current history pathname.
 * @deprecated
 * @param {Object} state The current application state.
 * @returns {string}
 */
export const getHistoryPathname = getCurrentPathname;

/**
 * Gets the length of the current history stack.
 * @param {Object} state The current application state.
 * @return {number}
 */
export const getHistoryLength = createSelector(
  getRouterStack,
  stack => stack.length
);

/**
 * Gets the current query params from history state as a preformatted string.
 * @param {Object} state The global state.
 * @return {string}
 */
export const getQueryParamsAsString = createSelector(
  getCurrentQuery,
  queryParams => parseObjectToQueryString(queryParams)
);

/**
 * Gets the current history location from the history state.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getHistoryLocation = createSelector(
  getHistoryPathname,
  getQueryParamsAsString,
  (pathname, params) => `${pathname}${params}`
);

/**
 * Gets the current redirectLocation from the history state.
 * @param {Object} state The current application state.
 * @deprecated
 * @return {string|null}
 */
export const getRedirectLocation = createSelector(
  getHistoryState,
  historyState => historyState.redirectLocation || null
);
