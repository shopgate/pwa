import { RECEIVE_SEARCH_SUGGESTIONS } from '../constants';

/**
 * Creates the dispatched RECEIVE_SEARCH_SUGGESTIONS action object.
 * @param {string} searchPhrase The search phrase.
 * @param {Array} suggestions Array of strings. The suggestions for the search phrase.
 * @return {Object} The RECEIVE_SEARCH_SUGGESTIONS action.
 */
const receiveSearchSuggestions = (searchPhrase, suggestions) => ({
  type: RECEIVE_SEARCH_SUGGESTIONS,
  searchPhrase,
  suggestions,
});

export default receiveSearchSuggestions;
