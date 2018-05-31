import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import * as pipelines from '../constants/Pipelines';
import requestSearchSuggestions from '../action-creators/requestSearchSuggestions';
import receiveSearchSuggestions from '../action-creators/receiveSearchSuggestions';
import {
  getCurrentSearchSuggestionsObject,
  getSearchSuggestionsPhrase,
} from '../selectors';
import removeHighlightingPlaceholders from '../helpers/removeHighlightingPlaceholders';

/**
 * Get suggestions from cache or pipeline.
 * @param {string} searchPhrase The search phrase.
 * @returns {undefined}
 */
const fetchSearchSuggestions = () => (dispatch, getState) => {
  const state = getState();
  const searchPhrase = getSearchSuggestionsPhrase(state);
  const cachedSuggestions = getCurrentSearchSuggestionsObject(state);

  if (!shouldFetchData(cachedSuggestions)) {
    return;
  }

  dispatch(requestSearchSuggestions(searchPhrase));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_SEARCH_SUGGESTIONS)
    .setInput({ searchPhrase })
    .dispatch()
    .then(({ suggestions }) => {
      dispatch(receiveSearchSuggestions(searchPhrase, removeHighlightingPlaceholders(suggestions)));
    });
};

export default fetchSearchSuggestions;
