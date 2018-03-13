import { REQUEST_SEARCH_SUGGESTIONS } from '../constants';

/**
 * Creates the dispatched REQUEST_SEARCH_SUGGESTIONS action object.
 * @param {string} searchPhrase The search phrase.
 * @return {Object} The REQUEST_SEARCH_SUGGESTIONS action.
 */
const requestSearchSuggestions = searchPhrase => ({
  type: REQUEST_SEARCH_SUGGESTIONS,
  searchPhrase,
});

export default requestSearchSuggestions;
