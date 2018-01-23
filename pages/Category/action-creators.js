/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_CATEGORY_VIEW_MODE } from './constants';

/**
 * Creates the dispatched SET_VIEW_MODE action object.
 * @param {string} viewMode The view mode for the category view.
 * @returns {Object} The dispatched action object.
 */
export const setCategoryViewMode = viewMode => ({
  type: SET_CATEGORY_VIEW_MODE,
  viewMode,
});
