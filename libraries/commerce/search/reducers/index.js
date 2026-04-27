import {
  REQUEST_SEARCH_SUGGESTIONS,
  RECEIVE_SEARCH_SUGGESTIONS,
  SEARCH_SUGGESTIONS_LIFETIME,
} from '../constants';
import {
  ADD_SEARCH_HISTORY,
  CLEAR_SEARCH_HISTORY,
} from '../constants/Portals';

const initialState = {
  suggestions: {},
  history: [],
};

/**
 * The search suggestions reducer.
 * @param {Object} [state={}] The current search suggestions state.
 * @param {Object} action The action object.
 * @return {Object} The updated search suggestions data.
 */
const search = (state = initialState, action = {}) => {
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

      // number of search history entries is limited to 10
    case ADD_SEARCH_HISTORY:
      return {
        ...state,
        history: [action.searchPhrase,
          ...state.history.filter(item => item !== action.searchPhrase)].slice(0, 10),
      };
    case CLEAR_SEARCH_HISTORY:
      return {
        ...state,
        history: [],
      };

    default:
      return state;
  }
};

export default search;
