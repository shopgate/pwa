import {
  REQUEST_USER,
  RECEIVE_USER,
  ERROR_USER,
  SUCCESS_LOGOUT,
} from '../../constants/ActionTypes';

/**
 * Stores the user data state
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function userDataReducer(state = {}, action) {
  switch (action.type) {
    case REQUEST_USER:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_USER:
      return {
        ...state,
        ...action.user,
        isFetching: false,
      };
    case ERROR_USER:
      return {
        isFetching: false,
      };
    case SUCCESS_LOGOUT:
      return {};
    default:
      return state;
  }
}
