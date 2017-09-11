/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import updateHistoryState from '@shopgate/pwa-common/actions/history/updateHistoryState';
import addActiveFiltersAction from '../action-creators/addActiveFilters';
import { getActiveFiltersStack, getHistoryFilterIndex } from '../selectors';

/**
 * Creates a new stack for active filters.
 *
 * We need to keep track of filters in order to restore them when the view changes and a
 * previous filter needs to be re-applied.
 * When going back the set on top of the stack will be removed and the previous one
 * will be active again.
 *
 * @returns {Function} A redux thunk.
 */
const addActiveFilters = () => (dispatch, getState) => {
  const state = getState();
  const filterIndex = getHistoryFilterIndex(state);

  if (filterIndex === null) {
    dispatch(addActiveFiltersAction());
    dispatch(updateHistoryState({
      filterIndex: getActiveFiltersStack(state).length,
    }));
  }
};

export default addActiveFilters;
