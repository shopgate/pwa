import { createSelector } from 'reselect';
import { getResultByHash } from '../../product/selectors/product';

export const hasSearchResults = createSelector(
  getResultByHash,
  (results) => {
    if (!results || !results.products || !results.products.length) {
      return false;
    }

    return true;
  }
);

/**
 * Returns the current search suggestions object.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCurrentSearchSuggestionsObject = (state) => {
  const cache = state.search.suggestions;
  const { searchPhrase } = state.navigator;

  if (!cache[searchPhrase]) {
    return {};
  }

  return cache[searchPhrase];
};

/**
 * Returns the current search suggestions as array of strings.
 * @param {Object} state The application state.
 * @returns {Array}
 */
export const getCurrentSearchSuggestions = state =>
  getCurrentSearchSuggestionsObject(state).suggestions || [];

/**
 * Returns whether the current search suggestions are still being fetched.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const isFetchingCurrentSearchSuggestions = (state) => {
  const { isFetching } = getCurrentSearchSuggestionsObject(state);

  if (typeof isFetching === 'undefined') {
    return true;
  }

  return isFetching;
};

/**
 * Get current search phrase.
 * @param {Object} state The application state.
 * @return {string}
 */
export const getSearchPhrase = state => state.navigator.searchPhrase || '';
