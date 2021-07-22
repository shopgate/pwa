import { SET_USER_GEOLOCATION, USER_SEARCH_GEOLOCATION_LIFETIME } from '../constants';

export const defaultState = {
  geolocation: null,
};

/**
 * @param {Object} state The current state.
 * @param {Object} action The action Object
 * @returns {Object} The new state.
 */
export default function user(
  state = defaultState,
  action
) {
  switch (action.type) {
    case SET_USER_GEOLOCATION:
      return {
        ...state,
        geolocation: {
          ...action.geolocation,
          expires: Date.now() + USER_SEARCH_GEOLOCATION_LIFETIME,
        },
      };
    default:
      return state;
  }
}
