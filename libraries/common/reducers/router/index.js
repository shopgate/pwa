import { ROUTE_DID_ENTER } from '../../constants/ActionTypes';

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
    case ROUTE_DID_ENTER:
      return {
        ...state,
        currentRoute: action.route,
      };
    default:
      return state;
  }
}
