/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_PAGE_CONFIG } from '../../constants/ActionTypes';

/**
 * Creates the dispatched ERROR_PAGE_CONFIG action object.
 * @param {Object} pageId The page id.
 * @returns {Object} The dispatched action object.
 */
const errorPageConfig = pageId => ({
  type: ERROR_PAGE_CONFIG,
  pageId,
});

export default errorPageConfig;
