import { createSelector } from 'reselect';

/**
 * @param {Object} state The appllication state.
 * @return {Object}
 */
export const getSuggestionsState = state => state.search.suggestions;

export const getSuggestions = createSelector(
  getSuggestionsState,
  (state, props) => props.searchPhrase,
  (suggestions, phrase) => {
    if (!phrase || !suggestions[phrase] || !suggestions[phrase].suggestions.length) {
      return null;
    }

    return suggestions[phrase].suggestions;
  }
);
