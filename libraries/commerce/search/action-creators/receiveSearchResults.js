import { RECEIVE_SEARCH_RESULTS } from '../constants';

/**
 * Creates the dispatched RECEIVE_SEARCH_RESULTS action object.
 * @param {string} searchPhrase The search phrase.
 * @param {number} offset The result offset.
 * @param {Object} results The search results.
 * @return {Object} The RECEIVE_SEARCH_RESULTS action.
 */
const receiveSearchResults = (searchPhrase, offset, results) => ({
  type: RECEIVE_SEARCH_RESULTS,
  searchPhrase,
  offset,
  results,
});

export default receiveSearchResults;
