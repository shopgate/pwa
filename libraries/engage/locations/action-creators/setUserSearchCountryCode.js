// @flow
import { type Action } from 'redux';
import { SET_USER_SEARCH_COUNTRY_CODE } from '../constants';

export type SetUserSearchCountryCodeActionType = Action<typeof SET_USER_SEARCH_COUNTRY_CODE> & {
  countryCode: string,
};

/**
 * Creates the dispatched SET_USER_SEARCH_COUNTRY_CODE action object.
 * @param {string} countryCode The countryCode.
 * @returns {Object}
 */
const setUserSearchCountryCode = (countryCode: string): SetUserSearchCountryCodeActionType => ({
  type: SET_USER_SEARCH_COUNTRY_CODE,
  countryCode,
});

export default setUserSearchCountryCode;
