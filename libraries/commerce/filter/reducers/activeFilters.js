/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cloneDeep from 'lodash/cloneDeep';
import {
  ADD_ACTIVE_FILTERS,
  SET_ACTIVE_FILTERS,
  REMOVE_ACTIVE_FILTERS,
  RESET_ACTIVE_FILTERS,
} from '../constants';

/**
 * Stores a collection of currently active filters.
 * @param {Object} [state=[]] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function activeFilters(state = [], action) {
  const { categoryId, searchPhrase } = action;

  switch (action.type) {
    case ADD_ACTIVE_FILTERS:
      return [
        ...state,
        {
          filters: {},
          ...categoryId && { categoryId },
          ...searchPhrase && { searchPhrase },
        },
      ];

    case SET_ACTIVE_FILTERS: {
      const newState = [
        ...state,
      ];

      newState[newState.length - 1] = {
        ...newState[newState.length - 1],
        ...categoryId && { categoryId },
        ...searchPhrase && { searchPhrase },
        filters: cloneDeep(action.activeFilters),
      };
      return newState;
    }

    case REMOVE_ACTIVE_FILTERS:
      return state.splice(0, state.length - 1) || [];

    case RESET_ACTIVE_FILTERS:
      return [];

    default:
      return state;
  }
}
