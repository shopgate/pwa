import { REQUEST_SEARCH_RESULTS } from '../constants';

/**
 * Creates the dispatched REQUEST_SEARCH_RESULTS action object.
 * @param {string} searchPhrase The search phrase.
 * @param {number} offset The result offset.
 * @return {Object} The REQUEST_SEARCH_RESULTS action.
 */
const requestSearchResults = (searchPhrase, offset) => ({
  type: REQUEST_SEARCH_RESULTS,
  searchPhrase,
  offset,
});

export default requestSearchResults;
