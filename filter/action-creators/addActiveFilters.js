/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ADD_ACTIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched ADD_ACTIVE_FILTERS action object.
 * @return {Object} The ADD_ACTIVE_FILTERS action.
 */
const addActiveFilters = () => ({
  type: ADD_ACTIVE_FILTERS,
});

export default addActiveFilters;
