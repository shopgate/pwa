import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import getProducts from '../../product/actions/getProducts';

/**
 * Retrieves category products by a category id.
 * @param {string} categoryId The category id to requests products for.
 * @param {number} offset The offset for the products to request.
 * @param {number} limit The number of products to request.
 * @param {string} sort The sort order of the products.
 * @return {Function} The dispatched action.
 */
const fetchCategoryProducts = (
  categoryId,
  offset = 0,
  limit = ITEMS_PER_LOAD
) =>
  (dispatch, getState) => {
    dispatch(getProducts({
      params: {
        categoryId,
        offset,
        limit,
        sort: getSortOrder(getState()),
      },
    }));
  };

export default fetchCategoryProducts;
