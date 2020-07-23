// @flow
import { type Action } from 'redux';
import { SET_USER_SEARCH_POSTAL_CODE } from '../constants';

export type SetUserSearchPostalCodeActionType = Action<typeof SET_USER_SEARCH_POSTAL_CODE> & {
  postalCode: string | null,
  productId: string | null,
  isStoreFinder: bool
};

/**
 * Creates the dispatched SET_USER_SEARCH_POSTAL_CODE action object.
 * @param {string} postalCode The postalCode.
 * @param {string} [productId=null] An optional product code.
 * @param {boolean} [isStoreFinder=false] Was the actions dispatched for the store finder
 * @returns {Object}
 */
const setUserSearchPostalCode = (
  postalCode: string | null,
  productId: string | null = null,
  isStoreFinder: bool = false
): SetUserSearchPostalCodeActionType => ({
  type: SET_USER_SEARCH_POSTAL_CODE,
  postalCode,
  productId,
  isStoreFinder,
});

export default setUserSearchPostalCode;
