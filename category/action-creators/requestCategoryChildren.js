/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_CATEGORY_CHILDREN } from '../constants';

/**
 * Dispatches the REQUEST_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to request children for.
 * @return {Object} The REQUEST_CATEGORY_CHILDREN action.
 */
const requestCategoryChildren = categoryId => ({
  type: REQUEST_CATEGORY_CHILDREN,
  categoryId,
});

export default requestCategoryChildren;
