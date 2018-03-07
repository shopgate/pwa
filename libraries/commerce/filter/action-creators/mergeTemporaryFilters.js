/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { MERGE_TEMPORARY_FILTERS } from '../constants';

/**
 * Creates the dispatched MERGE_TEMPORARY_FILTERS action object.
 * @param {Object} temporaryFilters Temporary filters.
 * @returns {Object} The MERGE_TEMPORARY_FILTERS action.
 */
const mergeTemporaryFilters = temporaryFilters => ({
  type: MERGE_TEMPORARY_FILTERS,
  temporaryFilters,
});

export default mergeTemporaryFilters;
