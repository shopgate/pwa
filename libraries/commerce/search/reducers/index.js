import {
  REQUEST_SEARCH_SUGGESTIONS,
  RECEIVE_SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTIONS_LIFETIME,
  SET_SEARCH_SUGGESTIONS_PHRASE,
} from '../constants';

const initialState = {
  suggestionsPhrase: '',
  suggestions: {},
};

/**
 * The search suggestions reducer.
 * @param {Object} [state={}] The current search suggestions state.
 * @param {Object} action The action object.
 * @return {Object} The updated search suggestions data.
 */
const search = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_SEARCH_SUGGESTIONS:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          [action.searchPhrase]: {
            isFetching: true,
            suggestions: [],
            expires: 0,
          },
        },
      };

    case RECEIVE_SEARCH_SUGGESTIONS:
      return {
        ...state,
        suggestions: {
          ...state.suggestions,
          [action.searchPhrase]: {
            isFetching: false,
            suggestions: action.suggestions,
            expires: Date.now() + SEARCH_SUGGESTIONS_LIFETIME,
          },
        },
      };
    case SET_SEARCH_SUGGESTIONS_PHRASE:
      return {
        ...state,
        suggestionsPhrase: action.suggestionsPhrase,
      };
    default:
      return state;
  }
};

export default search;
