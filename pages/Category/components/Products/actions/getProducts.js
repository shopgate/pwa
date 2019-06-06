import { getActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';

/**
 * @param {string} categoryId The category id to requests products for.
 * @param {string} sort The sort order for the products to request.
 * @param {number} offset The offset for the products to request.
 * @param {boolean} characteristics States whether to include characteristics or not.
 * @return {Function} A redux thunk.
 */
const getProducts = (categoryId, sort, offset, characteristics) => (dispatch, getState) => {
  const filters = getActiveFilters(getState());

  dispatch(fetchCategoryProducts({
    categoryId,
    sort,
    offset,
    filters,
    characteristics,
  }));
};

export default getProducts;
