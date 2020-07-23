// @flow
import { type Action } from 'redux';
import { SET_USER_SEARCH_COUNTRY_CODE } from '../constants';

export type SetUserSearchCountryCodeActionType = Action<typeof SET_USER_SEARCH_COUNTRY_CODE> & {
  countryCode: string,
  productId: string | null,
  isStoreFinder: bool,
};

/**
 * Creates the dispatched SET_USER_SEARCH_COUNTRY_CODE action object.
 * @param {string} countryCode The countryCode.
 * @param {string} [productId=null] An optional product code.
 * @param {boolean} [isStoreFinder=false] Was the actions dispatched for the store finder
 * @returns {Object}
 */
const setUserSearchCountryCode = (
  countryCode: string,
  productId: string | null = null,
  isStoreFinder: bool = false
): SetUserSearchCountryCodeActionType => ({
  type: SET_USER_SEARCH_COUNTRY_CODE,
  countryCode,
  productId,
  isStoreFinder,
});

export default setUserSearchCountryCode;
