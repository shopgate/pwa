import { createSelector } from 'reselect';

/**
 * @param {Object} state The appllication state.
 * @return {Object}
 */
export const getSuggestionsState = state => state.search.suggestions;

/**
 * Retrieves the search suggestions for a passed search phrase.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {Object|null} The suggestions
 */
export const getSuggestions = createSelector(
  getSuggestionsState,
  (state, props) => props.searchPhrase,
  (suggestions, phrase) => {
    if (!phrase || !suggestions[phrase]) {
      return null;
    }

    return suggestions[phrase].suggestions;
  }
);

/**
 * Detects if suggestions for a passed search phrase are currently fetching.
 * @param {Object} state The application state.
 * @param {Object} props The component props.
 * @returns {boolean}
 */
export const getSuggestionsFetchingState = createSelector(
  getSuggestionsState,
  (state, props) => props.searchPhrase,
  (suggestions, phrase) => {
    if (!phrase || !suggestions[phrase] || suggestions[phrase].isFetching === false) {
      return false;
    }

    return true;
  }
);
