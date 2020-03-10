// @flow
import * as Redux from 'redux';
import { STORE_SEARCH_QUERY } from '../constants';

/**
 * Stores the user's search query input.
 * @param {Object} state The current state.
 * @param {Object} action The action Object
 * @returns {Object} The new state.
 */
export default function searchQuery(state: string = '', action: Redux.Action) {
  switch (action.type) {
    case STORE_SEARCH_QUERY:
      return action.query;
    default:
      return state;
  }
}
