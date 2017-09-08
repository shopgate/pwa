/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_CATEGORY } from '../constants';

/**
 * Dispatches the REQUEST_CATEGORY action.
 * @param {string} categoryId The ID of the category to be requested.
 * @return {Object} The REQUEST_CATEGORY action.
 */
const requestCategory = categoryId => ({
  type: REQUEST_CATEGORY,
  categoryId,
});

export default requestCategory;
