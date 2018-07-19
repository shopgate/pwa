import cloneDeep from 'lodash/cloneDeep';
import {
  MERGE_TEMPORARY_FILTERS,
  SET_TEMPORARY_FILTERS,
  REMOVE_TEMPORARY_FILTER,
} from '../constants';

/**
 * Stores the temporary filters.
 * @param {Object} [state={}] The current state.
 * @param {Object} action The current redux action.
 * @return {Object} The new state.
 */
export default function temporaryFilters(state = {}, action) {
  switch (action.type) {
    case MERGE_TEMPORARY_FILTERS:
      return {
        ...state,
        ...action.temporaryFilters,
      };

    case SET_TEMPORARY_FILTERS:
      return {
        ...action.temporaryFilters,
      };

    case REMOVE_TEMPORARY_FILTER: {
      // Simply remove all filters if id is set to null
      if (action.id === null) {
        return {};
      }

      const temporaryCopy = cloneDeep(state);

      /**
       * If it's a simple filter or if all values of a multiselect
       * have been removed previously, delete the whole filter.
       */
      if (action.index === null || temporaryCopy[action.id].values.length === 1) {
        delete temporaryCopy[action.id];
      } else {
        // For multiselect filters only the appropriate value should be removed from the stack.
        temporaryCopy[action.id].values.splice(action.index, 1);
        temporaryCopy[action.id].valueLabels.splice(action.valueLabelIndex, 1);
      }

      return temporaryCopy;
    }

    default:
      return state;
  }
}
