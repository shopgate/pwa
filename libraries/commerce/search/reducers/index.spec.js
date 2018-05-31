import {
  REQUEST_SEARCH_SUGGESTIONS,
  RECEIVE_SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTIONS_LIFETIME,
  SET_SEARCH_SUGGESTIONS_PHRASE,
} from '../constants';

import reducer from './index';

const now = Date.now();
Date.now = jest.genMockFunction().mockReturnValue(now);

describe('search reducer', () => {
  const initialState = {
    suggestionsPhrase: '',
    suggestions: {},
  };

  describe('default state', () => {
    it('should work as expected', () => {
      const result = reducer(undefined, { type: 'foo' });
      expect(result).toEqual(initialState);
    });
  });

  describe('REQUEST_SEARCH_SUGGESTIONS', () => {
    it('should work as expected', () => {
      const searchPhrase = 'Search';
      const result = reducer(initialState, {
        type: REQUEST_SEARCH_SUGGESTIONS,
        searchPhrase,
      });

      expect(result.suggestions).toEqual({
        [searchPhrase]: {
          isFetching: true,
          suggestions: [],
          expires: 0,
        },
      });
    });
  });

  describe('RECEIVE_SEARCH_SUGGESTIONS', () => {
    it('should work as expected', () => {
      const searchPhrase = 'Search';
      const suggestions = ['One', 'Two'];

      const result = reducer(initialState, {
        type: RECEIVE_SEARCH_SUGGESTIONS,
        searchPhrase,
        suggestions,
      });

      expect(result.suggestions).toEqual({
        [searchPhrase]: {
          isFetching: false,
          expires: now + SEARCH_SUGGESTIONS_LIFETIME,
          suggestions,
        },
      });
    });
  });

  describe('SET_SEARCH_SUGGESTIONS_PHRASE', () => {
    it('should work as expected', () => {
      const suggestionsPhrase = 'Search';

      const result = reducer(initialState, {
        type: SET_SEARCH_SUGGESTIONS_PHRASE,
        suggestionsPhrase,
      });

      expect(result).toEqual({
        ...initialState,
        suggestionsPhrase,
      });
    });
  });
});
