/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_CATEGORY } from '../constants';

/**
 * Dispatches the ERROR_CATEGORY action.
 * @param {string} categoryId The ID of the received category.
 * @return {Object} The ERROR_CATEGORY action.
 */
const errorCategory = categoryId => ({
  type: ERROR_CATEGORY,
  categoryId,
});

export default errorCategory;
