import cloneDeep from 'lodash/cloneDeep';
import {
  ADD_ACTIVE_FILTERS,
  SET_ACTIVE_FILTERS,
  SLICE_ACTIVE_FILTERS,
} from '../constants';

/**
 * Stores a collection of currently active filters.
 * @param {Object} [state=[{}]] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function activeFilters(state = [{}], action) {
  switch (action.type) {
    case ADD_ACTIVE_FILTERS:
      return [
        ...state,
        {},
      ];

    case SET_ACTIVE_FILTERS: {
      const newState = [
        ...state,
      ];
      newState[newState.length - 1] = cloneDeep(action.activeFilters);
      return newState;
    }

    case SLICE_ACTIVE_FILTERS:
      return state.slice(0, action.version + 1);

    default:
      return state;
  }
}
