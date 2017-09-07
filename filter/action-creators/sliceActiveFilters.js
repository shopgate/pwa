/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SLICE_ACTIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched SLICE_ACTIVE_FILTERS action object.
 * @param {number} version Version number of the active filters that should be checked out.
 * @return {Object} The SLICE_ACTIVE_FILTERS action.
 */
const sliceActiveFilters = version => ({
  type: SLICE_ACTIVE_FILTERS,
  version,
});

export default sliceActiveFilters;
