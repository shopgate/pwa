import { buildFetchCategoryProductsParams } from '@shopgate/engage/product';
import { getActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';

/**
 * @param {string} categoryId The category id to requests products for.
 * @param {string} sort The sort order for the products to request.
 * @param {number} offset The offset for the products to request.
 * @return {Function} A redux thunk.
 */
const getProducts = (categoryId, sort, offset) => (dispatch, getState) => {
  const filters = getActiveFilters(getState());

  dispatch(fetchCategoryProducts({
    categoryId,
    sort,
    offset,
    filters,
    ...buildFetchCategoryProductsParams(),
  }));
};

export default getProducts;
