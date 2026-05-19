import { ADD_SEARCH_HISTORY, CLEAR_SEARCH_HISTORY } from '../constants/Portals';

/**
 * Creates the dispatched ADD_SEARCH_HISTORY action object.
 * @param {string} searchPhrase The search phrase to add to the history.
 * @return {Object} The action object.
 */
export const addSearchHistory = searchPhrase => ({
  type: ADD_SEARCH_HISTORY,
  searchPhrase,
});

/**
 * Creates the dispatched CLEAR_SEARCH_HISTORY action object.
 * @return {Object} The action object.
 */
export const clearSearchHistory = () => ({
  type: CLEAR_SEARCH_HISTORY,
});

