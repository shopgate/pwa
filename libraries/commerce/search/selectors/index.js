import { createSelector } from 'reselect';

/**
 * Get the current search phrase.
 * @param {Object} state The application state.
 * @return {string}
 */
export const getSearchSuggestionsPhrase = state => state.search.suggestionsPhrase || '';

/**
 * Get the current search suggestions.
 * @param {Object} state The application state.
 * @return {Object}
 */
export const getSearchSuggestions = state => state.search.suggestions;

/**
 * Returns the current search suggestions object.
 * @param {Object} state The application state.
 * @returns {Object}
 */
export const getCurrentSearchSuggestionsObject = createSelector(
  getSearchSuggestionsPhrase,
  getSearchSuggestions,
  (phrase, suggestions) => {
    if (!suggestions[phrase]) {
      return {};
    }

    return suggestions[phrase];
  }
);

/**
 * Returns the current search suggestions as array of strings.
 * @param {Object} state The application state.
 * @returns {Array}
 */

export const getCurrentSearchSuggestions = createSelector(
  getCurrentSearchSuggestionsObject,
  ({ suggestions }) => suggestions || []
);

/**
 * Returns whether the current search suggestions are still being fetched.
 * @param {Object} state The application state.
 * @returns {boolean}
 */
export const isFetchingCurrentSearchSuggestions = createSelector(
  getCurrentSearchSuggestionsObject,
  ({ isFetching = true }) => isFetching
);

