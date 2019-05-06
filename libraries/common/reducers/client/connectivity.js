import { RECEIVE_CLIENT_CONNECTIVITY } from '../../constants/ActionTypes';
import { CONNECTIVITY_NETWORK_UNKNOWN, CONNECTIVITY_TYPE_UNKNOWN } from '../../constants/client';

const defaultState = {
  connected: true,
  network: CONNECTIVITY_NETWORK_UNKNOWN,
  type: CONNECTIVITY_TYPE_UNKNOWN,
};

/**
 * Stores the client connectivity data.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function clientConnectivityReducer(state = defaultState, action) {
  switch (action.type) {
    case RECEIVE_CLIENT_CONNECTIVITY:
      return {
        ...state,
        ...defaultState,
        ...action.data,
      };
    default:
      return state;
  }
}
