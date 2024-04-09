import {
  ACCEPT_ALL_COOKIES,
  ACCEPT_REQUIRED_COOKIES,
  ACCEPT_SELECTED_COOKIES,
  CHANGE_COMFORT_COOKIES,
  CHANGE_STATISTICS_COOKIES,
} from '../constants';

const defaultState = {
  areComfortCookiesSelected: false,
  areStatisticsCookiesSelected: false,
};

/**
 * Stores all states of the cookie settings.
 * @param {Object} [state] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
const cookieSettingsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACCEPT_ALL_COOKIES: {
      return {
        ...state,
        areComfortCookiesSelected: true,
        areStatisticsCookiesSelected: true,
      };
    }
    case ACCEPT_REQUIRED_COOKIES: {
      return {
        ...state,
        areComfortCookiesSelected: false,
        areStatisticsCookiesSelected: false,
      };
    }
    case ACCEPT_SELECTED_COOKIES: {
      return {
        ...state,
      };
    }
    case CHANGE_COMFORT_COOKIES: {
      return {
        ...state,
        areComfortCookiesSelected: !state.areComfortCookiesSelected,
      };
    }
    case CHANGE_STATISTICS_COOKIES: {
      return {
        ...state,
        areStatisticsCookiesSelected: !state.areComfortCookiesSelected,
      };
    }

    default:
      return state;
  }
};

export default cookieSettingsReducer;
