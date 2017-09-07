/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REQUEST_FILTERS } from '../constants';

/**
 * Creates the dispatched REQUEST_FILTERS action object.
 * @param {string} hash The product list hash.
 * @return {Object} The REQUEST_PRODUCT action.
 */
const requestFilters = hash => ({
  type: REQUEST_FILTERS,
  hash,
});

export default requestFilters;
