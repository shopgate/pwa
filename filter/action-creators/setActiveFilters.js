/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_ACTIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched SET_ACTIVE_FILTERS action object.
 * @param {Object} activeFilters Active filters.
 * @returns {Object} The SET_ACTIVE_FILTERS action.
 */
const setActiveFilters = activeFilters => ({
  type: SET_ACTIVE_FILTERS,
  activeFilters,
});

export default setActiveFilters;
