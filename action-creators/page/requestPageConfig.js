/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_PAGE_CONFIG } from '../../constants/ActionTypes';

/**
 * Creates the dispatched REQUEST_PAGE_CONFIG action object.
 * @param {Object} pageId The page to get the widgets for.
 * @returns {Object} The dispatched action object.
 */
const requestPageConfig = pageId => ({
  type: REQUEST_PAGE_CONFIG,
  pageId,
});

export default requestPageConfig;
