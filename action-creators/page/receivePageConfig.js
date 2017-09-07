/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_PAGE_CONFIG } from '../../constants/ActionTypes';

/**
 * Creates the dispatched RECEIVE_PAGE_CONFIG action object.
 * @param {Object} pageId The page id.
 * @param {Object} config The page configuration.
 * @returns {Object} The dispatched action object.
 */
const receivePageConfig = (pageId, config) => ({
  type: RECEIVE_PAGE_CONFIG,
  pageId,
  config,
});

export default receivePageConfig;
