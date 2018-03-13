import { ERROR_SEARCH_RESULTS } from '../constants';

/**
 * Creates the dispatched ERROR_SEARCH_RESULTS action object.
 * @param {string} searchPhrase The search phrase.
 * @param {number} offset The result offset.
 * @return {Object} The ERROR_SEARCH_RESULTS action.
 */
const errorSearchResults = (searchPhrase, offset) => ({
  type: ERROR_SEARCH_RESULTS,
  searchPhrase,
  offset,
});

export default errorSearchResults;
