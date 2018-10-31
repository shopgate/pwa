import {
  getSuggestionsState,
  getSuggestions,
  getSuggestionsFetchingState,
} from './index';

const mockedState = {
  search: {
    suggestions: {
      notfetching: {
        isFetching: false,
        suggestions: [
          'Entry One',
          'Entry Two',
        ],
      },
      fetching: {
        isFetching: true,
        suggestions: [],
      },
    },
  },
};

describe('Search selectors', () => {
  const { suggestions } = mockedState.search;

  describe('getSuggestionsState()', () => {
    it('should return the state', () => {
      expect(getSuggestionsState(mockedState)).toEqual(suggestions);
    });
  });

  describe('getSuggestions()', () => {
    it('should return suggestions', () => {
      const searchPhrase = 'notfetching';
      const result = getSuggestions(mockedState, { searchPhrase });
      expect(result).toEqual(suggestions[searchPhrase].suggestions);
    });

    it('should return null if an empty search phrase was passed', () => {
      const searchPhrase = '';
      const result = getSuggestions(mockedState, { searchPhrase });
      expect(result).toBeNull();
    });

    it('should return null if the store does not contain an entry for the passed search phrase', () => {
      const searchPhrase = 'somephrase';
      const result = getSuggestions(mockedState, { searchPhrase });
      expect(result).toBeNull();
    });

    it('should return an empty array if the suggestions for the passed search phrase are empty ', () => {
      const searchPhrase = 'fetching';
      const result = getSuggestions(mockedState, { searchPhrase });
      expect(result).toEqual([]);
    });
  });

  describe('getSuggestionsFetchingState()', () => {
    it('should return true for fetching suggestions', () => {
      const searchPhrase = 'fetching';
      const result = getSuggestionsFetchingState(mockedState, { searchPhrase });
      expect(result).toBeTruthy();
    });

    it('should return false when the related store entry is not fetching', () => {
      const searchPhrase = 'notfetching';
      const result = getSuggestionsFetchingState(mockedState, { searchPhrase });
      expect(result).toBeFalsy();
    });

    it('should return false if an empty search phrase was passed', () => {
      const searchPhrase = '';
      const result = getSuggestionsFetchingState(mockedState, { searchPhrase });
      expect(result).toBeFalsy();
    });

    it('should return false if the store does not contain an entry for the passed search phrase', () => {
      const searchPhrase = 'somephrase';
      const result = getSuggestionsFetchingState(mockedState, { searchPhrase });
      expect(result).toBeFalsy();
    });
  });
});
