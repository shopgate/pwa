/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RECEIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched RECEIVE_FILTERS action object.
 * @param {string} hash The product list hash.
 * @param {Object} filters The available filters.
 * @return {Object} The RECEIVE_PRODUCT action.
 */
const receiveFilters = (hash, filters) => ({
  type: RECEIVE_FILTERS,
  hash,
  filters,
});

export default receiveFilters;
