/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  HISTORY_DID_RESET,
  HISTORY_WILL_RESET,
  OPEN_LINK,
  HISTORY_SET_REDIRECT_LOCATION,
  UPDATE_HISTORY,
} from '../../constants/ActionTypes';

/**
 * Creates the HISTORY_DID_RESET action object.
 * @returns {Object} A redux action.
 */
export const historyDidReset = () => ({
  type: HISTORY_DID_RESET,
});

/**
 * Creates the HISTORY_WILL_RESET action object.
 * @returns {Object} A redux action.
 */
export const historyWillReset = () => ({
  type: HISTORY_WILL_RESET,
});

/**
 * Creates the OPEN_LINK action object.
 * @param {Object} name The link action name.
 * @param {Object} options The link action options.
 * @returns {Object} A redux action.
 */
export const openLink = (name, options) => ({
  type: OPEN_LINK,
  name,
  options,
});

/**
 * Creates the HISTORY_SET_REDIRECT_LOCATION action object.
 * @param {string|null} pathname The url which should be stored.
 * @param {Object} [params={}] The params which should be stored.
 * @returns {Object} A redux action.
 */
export const setRedirectLocation = (pathname, params = {}) => ({
  type: HISTORY_SET_REDIRECT_LOCATION,
  pathname,
  params,
});

/**
 * Creates the UPDATE_HISTORY action object.
 * @param {Object} historyProps The updated history props.
 * @returns {Object} A redux action.
 */
export const updateHistory = historyProps => ({
  type: UPDATE_HISTORY,
  historyProps,
});
