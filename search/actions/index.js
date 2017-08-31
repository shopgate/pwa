import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
// TODO: remove mocked pipeline as soon as real pipeline available.
// eslint-disable-next-line capitalized-comments
// import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import PipelineRequest from './MockedPipeline';
import getProducts from '../../product/actions/getProducts';
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
export const getSearchResults = (offset = 0) => (dispatch, getState) => {
  const state = getState();
  const sort = getSortOrder(state);
  const limit = ITEMS_PER_LOAD;
  const searchPhrase = getSearchPhrase(state).trim();

  if (!searchPhrase) {
    return;
  }

  dispatch(
    getProducts({
      params: {
        searchPhrase,
        offset,
        limit,
        sort,
      },
    })
  );
};

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
