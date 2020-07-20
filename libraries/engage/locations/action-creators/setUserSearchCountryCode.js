// @flow
import { type Action } from 'redux';
import { SET_USER_SEARCH_COUNTRY_CODE } from '../constants';

export type SetUserSearchCountryCodeActionType = Action<typeof SET_USER_SEARCH_COUNTRY_CODE> & {
  countryCode: string,
  productId: string | null,
};

/**
 * Creates the dispatched SET_USER_SEARCH_COUNTRY_CODE action object.
 * @param {string} countryCode The countryCode.
 * @param {string} [productId=null] An optional product code.
 * @returns {Object}
 */
const setUserSearchCountryCode = (
  countryCode: string,
  productId: string | null = null
): SetUserSearchCountryCodeActionType => ({
  type: SET_USER_SEARCH_COUNTRY_CODE,
  countryCode,
  productId,
});

export default setUserSearchCountryCode;
