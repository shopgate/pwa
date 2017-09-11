/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sliceActiveFilters from '../action-creators/sliceActiveFilters';
import { getActiveFiltersStack, getHistoryFilterIndex } from '../selectors';

/**
 * Removes the last entry from the active filters stack.
 * @returns {Function} A redux thunk.
 */
const syncActiveFiltersWithHistory = () => (dispatch, getState) => {
  const state = getState();
  const filterIndex = getHistoryFilterIndex(state);

  // Only continue if history has filterIndex and the active filters stack changed.
  if (filterIndex !== null && getActiveFiltersStack(state).length !== (filterIndex + 1)) {
    // Removes the last active filters stack when history is updated.
    dispatch(sliceActiveFilters(filterIndex));
  }
};

export default syncActiveFiltersWithHistory;
