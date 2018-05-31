import {
  getCurrentSearchSuggestionsObject,
  getCurrentSearchSuggestions,
  isFetchingCurrentSearchSuggestions,
} from './index';

const phraseOne = 'One';
const suggestionsOne = [];
const phraseTwo = 'Two';
const suggestionsTwo = [1, 2];

/**
 * Creates a state.
 * @param {string} suggestionsPhrase The phrase for the state.
 * @return {Object}
 */
const createState = suggestionsPhrase => ({
  search: {
    suggestionsPhrase,
    suggestions: {
      [phraseOne]: {
        isFetching: false,
        suggestions: suggestionsOne,
      },
      [phraseTwo]: {
        isFetching: true,
        suggestions: suggestionsTwo,
      },
    },
  },
});

describe('search selectors', () => {
  describe('getCurrentSearchSuggestionsObject()', () => {
    it('should return an empty object if no match was found', () => {
      const state = createState('foo');
      const result = getCurrentSearchSuggestionsObject(state);
      expect(result).toEqual({});
    });

    it('should return the expected suggestions object', () => {
      const state = createState(phraseOne);
      const result = getCurrentSearchSuggestionsObject(state);
      expect(result).toEqual(state.search.suggestions[phraseOne]);
    });
  });

  describe('getCurrentSearchSuggestions()', () => {
    it('should return the expected suggestions', () => {
      const state = createState(phraseTwo);
      const result = getCurrentSearchSuggestions(state);
      expect(result).toEqual(suggestionsTwo);
    });

    it('should return an empty array if no suggestions are available for the phrase', () => {
      const state = createState('foo');
      const result = getCurrentSearchSuggestions(state);
      expect(result).toEqual([]);
    });
  });

  describe('isFetchingCurrentSearchSuggestions()', () => {
    it('should return true for a fetching entry', () => {
      const state = createState(phraseTwo);
      const result = isFetchingCurrentSearchSuggestions(state);
      expect(result).toBe(true);
    });

    it('should return false for a not fetching entry', () => {
      const state = createState(phraseOne);
      const result = isFetchingCurrentSearchSuggestions(state);
      expect(result).toBe(false);
    });

    it('should return true for a not existing entry', () => {
      const state = createState('foo');
      const result = isFetchingCurrentSearchSuggestions(state);
      expect(result).toBe(true);
    });
  });
});
