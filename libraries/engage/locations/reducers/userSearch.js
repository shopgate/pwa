import appConfig from '@shopgate/pwa-common/helpers/config';

import {
  SET_USER_SEARCH_COUNTRY_CODE,
  SET_USER_SEARCH_POSTAL_CODE,
  SET_USER_SEARCH_GEOLOCATION,
  USER_SEARCH_GEOLOCATION_LIFETIME,
} from '../constants';

export const defaultState = {
  geolocation: null,
  postalCode: null,
  countryCode: appConfig.marketId,
};

/**
 * Stores the user's search input.
 * @param {Object} state The current state.
 * @param {Object} action The action Object
 * @returns {Object} The new state.
 */
export default function search(
  state = defaultState,
  action
) {
  switch (action.type) {
    case SET_USER_SEARCH_COUNTRY_CODE:
      return {
        ...state,
        countryCode: action.countryCode,
      };
    case SET_USER_SEARCH_POSTAL_CODE:
      return {
        ...state,
        geolocation: null,
        postalCode: action.postalCode,
      };
    case SET_USER_SEARCH_GEOLOCATION:
      return {
        ...state,
        geolocation: {
          ...action.geolocation,
          expires: Date.now() + USER_SEARCH_GEOLOCATION_LIFETIME,
        },
        postalCode: null,

      };
    default:
      return state;
  }
}
