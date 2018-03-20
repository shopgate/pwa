import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import requestSearchSuggestions from '../action-creators/requestSearchSuggestions';
import receiveSearchSuggestions from '../action-creators/receiveSearchSuggestions';
import {
  getCurrentSearchSuggestionsObject,
  getSearchPhrase,
} from '../selectors';
import removeHighlightingPlaceholders from '../helpers/removeHighlightingPlaceholders';

/**
 * Get suggestions from cache or pipeline.
 * @param {string} searchPhrase The search phrase.
 * @returns {undefined}
 */
const fetchSearchSuggestions = () => (dispatch, getState) => {
  const state = getState();
  const searchPhrase = getSearchPhrase(state);
  const cachedSuggestions = getCurrentSearchSuggestionsObject(state);

  if (!shouldFetchData(cachedSuggestions)) {
    return;
  }

  dispatch(requestSearchSuggestions(searchPhrase));

  new PipelineRequest('getSearchSuggestions')
    .setInput({ searchPhrase })
    .dispatch()
    .then(({ suggestions }) => {
      dispatch(receiveSearchSuggestions(searchPhrase, removeHighlightingPlaceholders(suggestions)));
    });
};

export default fetchSearchSuggestions;
