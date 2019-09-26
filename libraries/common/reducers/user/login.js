import {
  APP_DID_START,
  REQUEST_LOGIN,
  SUCCESS_LOGIN,
  TOGGLE_LOGGED_IN,
  ERROR_LOGIN,
  SUCCESS_LOGOUT,
  DISABLE_LOGIN,
} from '../../constants/ActionTypes';

const defaultState = {
  isFetching: false,
  disabled: false,
  isLoggedIn: false,
  errors: null,
  strategy: null,
};

/**
 * Stores the login state
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function userLoginReducer(state = defaultState, action) {
  switch (action.type) {
    case APP_DID_START:
      return {
        ...state,
        disabled: false,
      };
    case DISABLE_LOGIN:
      return {
        ...state,
        disabled: action.value,
      };
    case REQUEST_LOGIN:
      return {
        ...state,
        strategy: action.strategy,
        isFetching: true,
      };
    case SUCCESS_LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        errors: null,
        isFetching: false,
        strategy: action.strategy,
      };
    case ERROR_LOGIN:
      return {
        ...state,
        errors: action.messages,
        isLoggedIn: false,
        isFetching: false,
      };
    case TOGGLE_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.value,
        strategy: null,
      };
    case SUCCESS_LOGOUT:
      return defaultState;
    default:
      return state;
  }
}
