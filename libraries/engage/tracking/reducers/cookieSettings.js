import { UPDATE_COOKIE_CONSENT } from '../constants';

const defaultState = {
  areComfortCookiesSelected: null,
  areStatisticsCookiesSelected: null,
};

/**
 * Stores all states of the cookie settings.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const cookieSettingsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_COOKIE_CONSENT: {
      return {
        ...state,
        areComfortCookiesSelected: action.areComfortCookiesSelected,
        areStatisticsCookiesSelected: action.areStatisticsCookiesSelected,
      };
    }

    default:
      return state;
  }
};

export default cookieSettingsReducer;
