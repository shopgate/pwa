import { logger } from '@shopgate/pwa-core/helpers';
import { ITEMS_PER_LOAD } from '@shopgate/pwa-common/constants/DisplayOptions';
import { getSortOrder } from '@shopgate/pwa-common/selectors/history';
import getProducts from '../../product/actions/getProducts';
import { getCurrentCategory } from '../selectors';

/**
 * Retrieves category products for a certain category by ID.
 * @param {number} offset The offset for the products to request.
 * @param {number} limit The amount of products to request.
 * @param {string} sort The sort order of the products.
 * @return {Function} The dispatched action.
 */
const fetchCategoryProducts = (offset = 0, limit = ITEMS_PER_LOAD, sort) =>
  (dispatch, getState) => {
    const state = getState();
    const category = getCurrentCategory(state);
    const sortOrder = sort || getSortOrder(state);

    if (!category) {
      logger.error(`Category '${category.id}' doesn't exist in the store. No products fetched.`);
      return;
    }

    dispatch(getProducts({
      params: {
        categoryId: category.id,
        offset,
        limit,
        sort: sortOrder,
      },
    }));
  };

export default fetchCategoryProducts;
