// @flow
import { type Action } from 'redux';
import { STORE_SEARCH } from '../constants';

type StoreSearchActionParams = {
  postalCode: string,
  countryCode: string,
};

export type StoreSearchActionType = Action<typeof STORE_SEARCH> & {
  search: StoreSearchActionParams,
};

/**
 * Creates the dispatched STORE_SEARCH action object.
 * @param {Object} search The user search.
 * @returns {Object}
 */
export const storeSearch = (search: StoreSearchActionParams): StoreSearchActionType => ({
  type: STORE_SEARCH,
  search,
});
