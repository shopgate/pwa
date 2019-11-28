import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CATALOG_GET_SEARCH_SUGGESTIONS } from '../constants/Pipelines';
import requestSearchSuggestions from '../action-creators/requestSearchSuggestions';
import receiveSearchSuggestions from '../action-creators/receiveSearchSuggestions';
import { getSuggestionsState } from '../selectors';
import removeHighlightingPlaceholders from '../helpers/removeHighlightingPlaceholders';

/**
 * Get suggestions from cache or pipeline.
 * @param {string} searchPhrase The search phrase.
 * @returns {Function} A redux thunk.
 */
function fetchSearchSuggestions(searchPhrase) {
  return (dispatch, getState) => {
    if (searchPhrase.length < 3) {
      return Promise.resolve(null);
    }

    const cached = getSuggestionsState(getState())[searchPhrase];

    if (cached && (cached.isFetching || cached.expires >= Date.now())) {
      return Promise.resolve(null);
    }

    dispatch(requestSearchSuggestions(searchPhrase));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_SEARCH_SUGGESTIONS)
      .setInput({ searchPhrase })
      .dispatch();

    request
      .then((result) => {
        const { suggestions } = result;
        const suggestionsWithoutPlaceholders = removeHighlightingPlaceholders(suggestions);
        dispatch(receiveSearchSuggestions(searchPhrase, suggestionsWithoutPlaceholders));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchSearchSuggestions);
