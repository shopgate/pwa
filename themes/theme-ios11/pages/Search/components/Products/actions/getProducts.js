import { buildFetchSearchResultsParams } from '@shopgate/engage/product';
import { getActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';

/**
 * @param {string} searchPhrase The search phrase to requests products for.
 * @param {string} sort The sort order for the products to request.
 * @param {number} offset The offset for the products to request.
 * @return {Function} A redux thunk.
 */
const getProducts = (searchPhrase, sort, offset) => (dispatch, getState) => {
  const filters = getActiveFilters(getState());

  dispatch(fetchSearchResults({
    searchPhrase,
    offset,
    filters,
    sort,
    ...buildFetchSearchResultsParams(),
  }));
};

export default getProducts;
