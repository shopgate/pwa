import {
  REQUEST_CLIENT_INFORMATION,
  RECEIVE_CLIENT_INFORMATION,
  ERROR_CLIENT_INFORMATION,
} from '../../constants/ActionTypes';
import { persist } from '../../store/persistent';
/**
 * The current version of the state created by this reducer.
 * @type {string}
 */
const STATE_VERSION = 'v1';
const defaultState = {};

/**
 * Stores all the client information.
 * This part of the store is stored in the localStorage!
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const reducer = (state = defaultState, action) => {
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
};

export default persist('client', reducer, STATE_VERSION);
