/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_PAGE_CONFIG,
  RECEIVE_PAGE_CONFIG,
  ERROR_PAGE_CONFIG,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_PAGE_CONFIG action object.
 * @param {Object} pageId The page to get the widgets for.
 * @returns {Object} The dispatched action object.
 */
export const requestPageConfig = pageId => ({
  type: REQUEST_PAGE_CONFIG,
  pageId,
});

/**
 * Creates the dispatched RECEIVE_PAGE_CONFIG action object.
 * @param {Object} pageId The page id.
 * @param {Object} config The page configuration.
 * @returns {Object} The dispatched action object.
 */
export const receivePageConfig = (pageId, config) => ({
  type: RECEIVE_PAGE_CONFIG,
  pageId,
  config,
});

/**
 * Creates the dispatched ERROR_PAGE_CONFIG action object.
 * @param {Object} pageId The page id.
 * @returns {Object} The dispatched action object.
 */
export const errorPageConfig = pageId => ({
  type: ERROR_PAGE_CONFIG,
  pageId,
});
