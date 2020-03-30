// @flow
import appConfig from '@shopgate/pwa-common/helpers/config';
import {
  SET_USER_SEARCH_COUNTRY_CODE,
  SET_USER_SEARCH_POSTAL_CODE,
} from '../constants';
import type { SetUserSearchCountryCodeActionType } from '../action-creators/setUserSearchCountryCode';
import type { SetUserSearchPostalCodeActionType } from '../action-creators/setUserSearchPostalCode';

export type UserSearchStateType = {
  postalCode: string | null,
  countryCode: string,
};

export const defaultState: UserSearchStateType = {
  // NULL as postalCode indicates that the store search shall use search by geolocation as strategy.
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
  state: UserSearchStateType = defaultState,
  action: SetUserSearchCountryCodeActionType | SetUserSearchPostalCodeActionType
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
        postalCode: action.postalCode,
      };
    default:
      return state;
  }
}
