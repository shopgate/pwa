import { UPDATE_COOKIE_CONSENT } from '../constants';

const defaultState = {
  comfortCookiesAccepted: null,
  statisticsCookiesAccepted: null,
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
        comfortCookiesAccepted: action.comfortCookiesAccepted,
        statisticsCookiesAccepted: action.statisticsCookiesAccepted,
      };
    }

    default:
      return state;
  }
};

export default cookieSettingsReducer;
