// @flow
import { type Action } from 'redux';
import { STORE_SEARCH_QUERY } from '../constants';

/**
 * Creates the dispatched STORE_SEARCH_QUERY action object.
 * @param {string} query The user search query.
 * @returns {Object}
 */
export const storeSearchQuery = (query: string): Action<typeof STORE_SEARCH_QUERY> => ({
  type: STORE_SEARCH_QUERY,
  query,
});
