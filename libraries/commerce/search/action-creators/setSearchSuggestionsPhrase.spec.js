import { SET_SEARCH_SUGGESTIONS_PHRASE } from '../constants';
import setSearchSuggestionsPhrase from './setSearchSuggestionsPhrase';

describe('setSearchSuggestionsPhrase selector', () => {
  it('work as expected if no phrase was passed', () => {
    const result = setSearchSuggestionsPhrase();
    expect(result).toEqual({
      type: SET_SEARCH_SUGGESTIONS_PHRASE,
      suggestionsPhrase: '',
    });
  });

  it('work as expected if a phrase was passed', () => {
    const suggestionsPhrase = 'Search term';
    const result = setSearchSuggestionsPhrase(suggestionsPhrase);
    expect(result).toEqual({
      type: SET_SEARCH_SUGGESTIONS_PHRASE,
      suggestionsPhrase,
    });
  });
});
