import { DEFAULT_SORT, ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import fetchProducts from '../../product/actions/fetchProducts';
import requestSearchResults from '../action-creators/requestSearchResults';
import receiveSearchResults from '../action-creators/receiveSearchResults';
import errorSearchResults from '../action-creators/errorSearchResults';

/**
 * Retrieves products for a certain search query.
 * @param {number} params The params for the products to request.
 * @return {Function} The dispatched action.
 */
const fetchSearchResults = params => (dispatch) => {
  const {
    offset = 0,
    searchPhrase,
    limit = ITEMS_PER_LOAD,
    sort = DEFAULT_SORT,
    filters = null,
    params: searchParams = null,
    cachedTime = null,
  } = params;

  if (!searchPhrase) {
    return;
  }

  const promise = dispatch(fetchProducts({
    cachedTime,
    params: {
      searchPhrase,
      offset,
      limit,
      sort,
      ...searchParams,
    },
    filters,
    onBeforeDispatch: () => {
      // Dispatch the request action before the related pipeline request is executed.
      dispatch(requestSearchResults(searchPhrase, offset));
    },
  }));

  /**
   * Whenever fetchProducts is able to deliver product data
   * - either via a request or from the cache -
   * it returns a promise which will be resolved with the response data.
   */
  if (promise instanceof Promise) {
    promise.then((response) => {
      // Inspect the response object to determine, if it represents a search result, or an error.
      if (response && response.products && Array.isArray(response.products)) {
        // Dispatch the receive action when the response contains valid data.s
        dispatch(receiveSearchResults(searchPhrase, offset, response));
      } else {
        // If no valid data is delivered within the response the error action is dispatched.
        dispatch(errorSearchResults(searchPhrase, offset));
      }
    });
  }
};

export default fetchSearchResults;
