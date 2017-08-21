import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
// TODO remove mocked pipeline as soon as real pipeline available.
// eslint-disable-next-line capitalized-comments
// import PipelineRequest from 'Library/classes/PipelineRequest';
import PipelineRequest from './MockedPipeline';
import { getProducts } from '../../product/actions';
import {
  requestSearchSuggestions,
  receiveSearchSuggestions,
} from '../action-creators';
import {
  getCurrentSearchSuggestionsObject,
  getSearchPhrase,
} from '../selectors';

/**
 * Retrieves products for a certain search query.
 * @param {string} searchPhrase The search query.
 * @param {number} offset The offset for the products to request.
 * @param {number} limit The amount of products to request.
 * @param {string} sort The sort order of the products.
 * @return {Function} The dispatched action.
 */
export const getSearchResults = (
  searchPhrase,
  offset = 0,
  limit = 30,
  sort = DEFAULT_SORT
) => dispatch =>
  dispatch(
    getProducts({
      params: {
        searchPhrase: searchPhrase.trim(),
        offset,
        limit,
        sort,
      },
    })
  );

/**
 * Get suggestions from cache or pipeline.
 * @param {string} searchPhrase The search phrase.
 * @returns {undefined}
 */
export const fetchSearchSuggestions = () => (dispatch, getState) => {
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
      dispatch(receiveSearchSuggestions(searchPhrase, suggestions));
    });
};
