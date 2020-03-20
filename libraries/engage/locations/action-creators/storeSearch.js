// @flow
import { type Action } from 'redux';
import { STORE_SEARCH } from '../constants';
import { type UserSearchStateType } from '../reducers/userSearch';

/**
 * Creates the dispatched STORE_SEARCH_QUERY action object.
 * @param {Object} search The user search.
 * @returns {Object}
 */
export const storeSearch = (search: UserSearchStateType): Action<typeof STORE_SEARCH> => ({
  type: STORE_SEARCH,
  search,
});
