import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import fetchProducts from '../../product/actions/fetchProducts';

/**
 * Retrieves category products by a category id.
 * @param {string} categoryId The category id to requests products for.
 * @param {number} offset The offset for the products to request.
 * @param {number} limit The number of products to request.
 * @param {string} sort The sort order of the products.
 * @param {boolean} characteristics Include characteristics.
 * @return {Function} The dispatched action.
 */
const fetchCategoryProducts = ({
  categoryId,
  filters = null,
  offset = 0,
  limit = ITEMS_PER_LOAD,
  sort,
  characteristics = false,
}) =>
  (dispatch, getState) => {
    const sortOrder = sort || getSortOrder(getState());

    dispatch(fetchProducts({
      params: {
        categoryId,
        offset,
        limit,
        sort: sortOrder,
        characteristics,
      },
      filters,
    }));
  };

export default fetchCategoryProducts;
