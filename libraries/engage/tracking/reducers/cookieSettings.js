import { appConfig } from '@shopgate/engage';
import { UPDATE_COOKIE_CONSENT } from '../constants';

const defaultState = {
  comfortCookiesAccepted: null,
  statisticsCookiesAccepted: null,
};

const { cookieConsent: { showComfortCookiesToggle } = {} } = appConfig;

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
        comfortCookiesAccepted: showComfortCookiesToggle === true
          ? action.comfortCookiesAccepted
          : true,
        statisticsCookiesAccepted: action.statisticsCookiesAccepted,
      };
    }

    default:
      return state;
  }
};

export default cookieSettingsReducer;
