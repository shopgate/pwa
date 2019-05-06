import {
  REQUEST_CLIENT_INFORMATION,
  RECEIVE_CLIENT_INFORMATION,
  ERROR_CLIENT_INFORMATION,
} from '../../constants/ActionTypes';

const defaultState = {};

/**
 * Stores all the client information.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function clientInformationReducer(state = defaultState, action) {
  switch (action.type) {
    case REQUEST_CLIENT_INFORMATION:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_CLIENT_INFORMATION:
      return {
        ...state,
        ...action.data,
        isFetching: false,
      };
    case ERROR_CLIENT_INFORMATION:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
}
