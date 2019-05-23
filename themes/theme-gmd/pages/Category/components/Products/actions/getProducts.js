import { getActiveFilters } from '@shopgate/engage/filter';
import { fetchCategoryProducts } from '@shopgate/engage/category';

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
  }));
};

export default getProducts;
