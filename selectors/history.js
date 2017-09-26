/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import { parseObjectToQueryString } from '../helpers/router';
import { DEFAULT_SORT } from '../constants/DisplayOptions';

/**
 * Selects the history state.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getHistoryState = state => state.history;

/**
 * Selects the current query params from history state.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getQueryParams = state => getHistoryState(state).queryParams;

/**
 * Retrieves a single url parameter from the query parameters object.
 * @param {Object} state The global state.
 * @param {string} param The dedicated url parameter.
 * @return {*} The URL parameter value.
 */
export const getQueryParam = (state, param) => getQueryParams(state)[param];

/**
 * Retrieves the sort order from the URL query parameters.
 * @param {Object} state The global state.
 * @returns {string} The current sort order.
 */
export const getSortOrder = createSelector(
  state => getQueryParam(state, 'sort'),
  param => param || DEFAULT_SORT
);

/**
 * Retrieves the search phrase from the URL query parameters.
 * @param {Object} state The global state.
 * @returns {string|null} The current search phrase.
 */
export const getSearchPhrase = createSelector(
  state => getQueryParam(state, 's'),
  (param) => {
    if (param) {
      return param.trim();
    }

    return null;
  }
);

/**
 * Gets the current history pathname.
 * @param {Object} state The current application state.
 * @returns {string}
 */
export const getHistoryPathname = createSelector(
  getHistoryState,
  historyState => historyState.pathname
);

/**
 * Gets the length of the current history stack.
 * @param {Object} state The current application state.
 * @return {number}
 */
export const getHistoryLength = createSelector(
  getHistoryState,
  historyState => historyState.length
);

/**
 * Gets the current redirectLocation from the history state.
 * @param {Object} state The current application state.
 * @return {string|null}
 */
export const getRedirectLocation = createSelector(
  getHistoryState,
  historyState => historyState.redirectLocation || null
);

/**
 * Gets the current query params from history state as a preformatted string.
 * @param {Object} state The global state.
 * @return {string}
 */
export const getQueryParamsAsString = createSelector(
  getQueryParams,
  queryParams => parseObjectToQueryString(queryParams)
);
