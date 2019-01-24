import cloneDeep from 'lodash/cloneDeep';
import { ROUTE_WILL_ENTER, ROUTE_DID_UPDATE } from '../../constants/ActionTypes';

const defaultState = {
  currentRoute: null,
};

/**
 * @param {Object} state The current state.
 * @param {Object} action The action object.
 * @returns {Object}
 */
export default function router(state = defaultState, action) {
  switch (action.type) {
    case ROUTE_WILL_ENTER:
      return {
        ...state,
        currentRoute: cloneDeep(action.route),
      };
    case ROUTE_DID_UPDATE: {
      const { id: currentId } = state.currentRoute || {};
      const { id: updatedId } = action.route;

      if (currentId === updatedId) {
        return {
          ...state,
          currentRoute: cloneDeep(action.route),
        };
      }

      return state;
    }
    default:
      return state;
  }
}
