// @flow
import { type Action } from 'redux';
import { SET_USER_SEARCH_POSTAL_CODE } from '../constants';

export type SetUserSearchPostalCodeActionType = Action<typeof SET_USER_SEARCH_POSTAL_CODE> & {
  postalCode: string | null,
};

/**
 * Creates the dispatched SET_USER_SEARCH_POSTAL_CODE action object.
 * @param {string} postalCode The postalCode.
 * @returns {Object}
 */
const setUserSearchPostalCode = (postalCode: string | null): SetUserSearchPostalCodeActionType => ({
  type: SET_USER_SEARCH_POSTAL_CODE,
  postalCode,
});

export default setUserSearchPostalCode;
