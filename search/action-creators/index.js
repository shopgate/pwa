import {
  REQUEST_SEARCH_SUGGESTIONS,
  RECEIVE_SEARCH_SUGGESTIONS,
} from '../constants';

/**
 * Creates the dispatched REQUEST_SEARCH_SUGGESTIONS action object.
 * @param {string} searchPhrase The search phrase.
 * @return {Object} The REQUEST_SEARCH_SUGGESTIONS action.
 */
export const requestSearchSuggestions = searchPhrase => ({
  type: REQUEST_SEARCH_SUGGESTIONS,
  searchPhrase,
});

/**
 * Creates the dispatched RECEIVE_SEARCH_SUGGESTIONS action object.
 * @param {string} searchPhrase The search phrase.
 * @param {Array} suggestions Array of strings. The suggestions for the search phrase.
 * @return {Object} The RECEIVE_SEARCH_SUGGESTIONS action.
 */
export const receiveSearchSuggestions = (searchPhrase, suggestions) => ({
  type: RECEIVE_SEARCH_SUGGESTIONS,
  searchPhrase,
  suggestions,
});
