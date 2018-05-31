import { SET_SEARCH_SUGGESTIONS_PHRASE } from '../constants';

/**
 * Creates the dispatched SET_SEARCH_SUGGESTIONS_PHRASE action object.
 * @param {string} [suggestionsPhrase=''] The search suggestions phrase.
 * @return {Object} The SET_SEARCH_SUGGESTIONS_PHRASE action.
 */
const setSearchSuggestionsPhrase = (suggestionsPhrase = '') => ({
  type: SET_SEARCH_SUGGESTIONS_PHRASE,
  suggestionsPhrase,
});

export default setSearchSuggestionsPhrase;
