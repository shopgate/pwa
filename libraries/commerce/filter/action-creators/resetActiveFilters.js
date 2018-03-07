/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RESET_ACTIVE_FILTERS } from '../constants';

/**
 * Creates the dispatched RESET_ACTIVE_FILTERS action object.
 * @return {Object} The RESET_ACTIVE_FILTERS action.
 */
const resetActiveFilters = () => ({
  type: RESET_ACTIVE_FILTERS,
});

export default resetActiveFilters;
