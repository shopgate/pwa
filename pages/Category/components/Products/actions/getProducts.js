import { getActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';

/**
 * @param {string} categoryId The category id to requests products for.
 * @param {number} offset The offset for the products to request.
 * @return {Function} A redux thunk.
 */
const getProducts = (categoryId, offset) => (dispatch, getState) => {
  const filters = getActiveFilters(getState());

  dispatch(fetchCategoryProducts({
    categoryId,
    offset,
    filters,
  }));
};

export default getProducts;
