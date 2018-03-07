/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SET_TEMPORARY_FILTERS } from '../constants';

/**
 * Creates the dispatched SET_TEMPORARY_FILTERS action object.
 * @param {Object} temporaryFilters Temporary filters.
 * @returns {Object} The SET_TEMPORARY_FILTERS action.
 */
const setTemporaryFilters = temporaryFilters => ({
  type: SET_TEMPORARY_FILTERS,
  temporaryFilters,
});

export default setTemporaryFilters;
