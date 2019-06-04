import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import fetchProducts from '../../product/actions/fetchProducts';

/**
 * Retrieves category products by a category id.
 * @param {string} categoryId The category id to requests products for.
 * @param {Object} [filters=null] The filters.
 * @param {number} offset The offset for the products to request.
 * @param {number} limit The number of products to request.
 * @param {string} sort The sort order of the products.
 * @param {boolean} [cached=true] The cache strategy.
 * @param {null|number} [cachedTime=null] The cache TTL.
 * @param {Object} params additional params.
 * @return {Function} The dispatched action.
 */
const fetchCategoryProducts = ({
  categoryId,
  filters = null,
  offset = 0,
  limit = ITEMS_PER_LOAD,
  sort,
  cached = true,
  cachedTime = null,
  params,
}) =>
  (dispatch, getState) => {
    const sortOrder = sort || getSortOrder(getState());

    dispatch(fetchProducts({
      cached,
      cachedTime,
      params: {
        categoryId,
        offset,
        limit,
        sort: sortOrder,
        ...params,
      },
      filters,
    }));
  };

export default fetchCategoryProducts;
