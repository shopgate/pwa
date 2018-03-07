/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Returns url state (state.url)
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getUrlState = state => state.url;

/**
 * Returns the complete state entry for state.url[type]
 * @param {string} type The url type.
 * @param {Object} state The application state.
 * @returns {Object|undefined}
 */
export const getEntryByType = (type, state) => getUrlState(state)[type];

/**
 * Returns the url for the given url type.
 * @param {string} type The url type.
 * @param {Object} state The application state.
 * @returns {string|null}
 */
export const getUrl = (type, state) => {
  const entry = getEntryByType(type, state);
  return entry ? entry.url : null;
};
