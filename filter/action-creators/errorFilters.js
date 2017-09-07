/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ERROR_FILTERS } from '../constants';

/**
 * Creates the dispatched ERROR_FILTERS action object
 * @param {string} hash The product list hash.
 * @return {Object} The ERROR_PRODUCT action.
 */
const errorFilters = hash => ({
  type: ERROR_FILTERS,
  hash,
});

export default errorFilters;
