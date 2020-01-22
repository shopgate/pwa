import {
  REQUEST_URL,
  RECEIVE_URL,
  ERROR_URL,
} from '../../constants/ActionTypes';

const URL_LIFETIME = 300000; // 5 minutes in milliseconds
const defaultState = {};

/**
 * Stores the requested urls
 * This part of the store is stored in the localStorage!
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default function urlReducer(state = defaultState, action) {
  switch (action.type) {
    case REQUEST_URL:
      return {
        ...state,
        [action.urlType]: {
          ...state[action.urlType],
          url: null,
          isFetching: true,
          expires: 0,
        },
      };
    case RECEIVE_URL:
      return {
        ...state,
        [action.urlType]: {
          ...state[action.urlType],
          url: action.url,
          isFetching: false,
          expires: action.expires ? Date.parse(action.expires) : (Date.now() + URL_LIFETIME),
        },
      };
    case ERROR_URL:
      return {
        ...state,
        [action.urlType]: {
          ...state[action.urlType],
          url: null,
          isFetching: false,
          expires: 0,
        },
      };
    default:
      return state;
  }
}
