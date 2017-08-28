import logger from '@shopgate/pwa-core/classes/Logger';
import { DEFAULT_SORT } from '@shopgate/pwa-common/constants/DisplayOptions';
import getProducts from '../../product/actions/getProducts';
import { getCurrentCategoryId } from '../selectors';

/**
 * Retrieves category products for a certain category by ID.
 * @param {number} offset The offset for the products to request.
 * @param {number} limit The amount of products to request.
 * @param {string} sort The sort order of the products.
 * @return {Function} The dispatched action.
 */
const fetchCategoryProducts =
  (offset = 0, limit = 30, sort = DEFAULT_SORT) =>
    (dispatch, getState) => {
      const state = getState();
      const categoryId = getCurrentCategoryId(state);
      const category = state.category.categoriesById[categoryId];

      if (!category) {
        logger.error(`Category '${categoryId}' doesn't exist in the store. No products fetched.`);
        return;
      }

      dispatch(getProducts({
        params: {
          categoryId,
          offset,
          limit,
          sort,
        },
      }));
    };

export default fetchCategoryProducts;
