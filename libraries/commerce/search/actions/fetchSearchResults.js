import { DEFAULT_SORT, ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import fetchProducts from '../../product/actions/fetchProducts';
import requestSearchResults from '../action-creators/requestSearchResults';
import receiveSearchResults from '../action-creators/receiveSearchResults';
import errorSearchResults from '../action-creators/errorSearchResults';

/**
 * Retrieves products for a certain search query.
 * @param {Object} params The params for the search products to request.
 * @param {string} params.searchPhrase Search phrase for the request
 * @param {number} [params.offset=0] Offset for the request
 * @param {number} [params.limit=ITEMS_PER_LOAD] Limit for the request
 * @param {string} [params.sort=DEFAULT_SORT] Limit for the request
 * @param {Object} [params.filters = null] Filters object for the request
 * @param {Object} [params.params = null] Additional params for the fetchProducts pipeline request
 * @param {number} [params.cachedTime=null] Cache TTL in ms.
 * @param {boolean} [params.resolveCachedProducts=false] Whether to resolve with products even
 * when no actual request was done due to cached data.
 * @return {Function} The dispatched action.
 */
const fetchSearchResults = params => (dispatch) => {
  const {
    offset = 0,
    searchPhrase,
    limit = ITEMS_PER_LOAD,
    sort = DEFAULT_SORT,
    filters,
    params: searchParams = null,
    cachedTime = null,
    resolveCachedProducts = false,
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
    resolveCachedProducts,
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
        dispatch(receiveSearchResults(searchPhrase, filters, offset, response));
      } else {
        // If no valid data is delivered within the response the error action is dispatched.
        dispatch(errorSearchResults(searchPhrase, offset));
      }
    });
  }

  // eslint-disable-next-line consistent-return
  return promise;
};

/** @mixes {MutableFunction} */
export default mutable(fetchSearchResults);
