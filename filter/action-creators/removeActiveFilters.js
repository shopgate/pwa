/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { REMOVE_ACTIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched REMOVE_ACTIVE_FILTERS action object.
 * @return {Object} The REMOVE_ACTIVE_FILTERS action.
 */
const removeActiveFilters = () => ({
  type: REMOVE_ACTIVE_FILTERS,
});

export default removeActiveFilters;
