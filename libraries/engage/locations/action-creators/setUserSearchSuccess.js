// @flow
import { type Action } from 'redux';
import { SET_USER_SEARCH_SUCCESS } from '../constants';

export type SetUserSearchSuccessType = Action<typeof SET_USER_SEARCH_SUCCESS> & {
  success: boolean,
};

/**
 * Creates the dispatched SET_USER_SEARCH_SUCCESS action object.
 * @param {boolean} success The success state
 * @returns {Object}
 */
const setUserSearchSuccess = (
  success: boolean = true
): SetUserSearchSuccessType => ({
  type: SET_USER_SEARCH_SUCCESS,
  success,
});

export default setUserSearchSuccess;
