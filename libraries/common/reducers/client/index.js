import {
  REQUEST_CLIENT_INFORMATION,
  RECEIVE_CLIENT_INFORMATION,
  ERROR_CLIENT_INFORMATION,
} from '../../constants/ActionTypes';

/**
 * Stores all the client information.
 * This part of the store is stored in the localStorage!
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = {}, action) => {
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
