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
 * @returns {undefined}
 */
const fetchSearchSuggestions = searchPhrase => (dispatch, getState) => {
  if (searchPhrase.length < 3) {
    return;
  }

  const cached = getSuggestionsState(getState())[searchPhrase];

  if (cached && (cached.isFetching || cached.expires >= Date.now())) {
    return;
  }

  dispatch(requestSearchSuggestions(searchPhrase));

  new PipelineRequest(SHOPGATE_CATALOG_GET_SEARCH_SUGGESTIONS)
    .setInput({ searchPhrase })
    .dispatch()
    .then(({ suggestions }) => {
      dispatch(receiveSearchSuggestions(searchPhrase, removeHighlightingPlaceholders(suggestions)));
    });
};

/** @mixes {MutableFunction} */
export default mutable(fetchSearchSuggestions);
