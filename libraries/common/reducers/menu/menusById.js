import {
  REQUEST_MENU,
  RECEIVE_MENU,
  ERROR_MENU,
} from '../../constants/ActionTypes';

/**
 * Stores the entries of the service menu.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function menusByIdReducer(state = {}, action) {
  switch (action.type) {
    case REQUEST_MENU: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          isFetching: true,
        },
      };
    }
    case RECEIVE_MENU: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          entries: action.entries,
          isFetching: false,
        },
      };
    }
    case ERROR_MENU: {
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          isFetching: false,
        },
      };
    }
    default:
      return state;
  }
}
