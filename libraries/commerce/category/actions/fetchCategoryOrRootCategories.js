import { mutable } from '@shopgate/pwa-common/helpers/redux';
import fetchRootCategories from './fetchRootCategories';
import fetchCategory from './fetchCategory';

/**
 * Retrieves a category from the server when a categoryId is given. Otherwise it will fetch the
 * root categories.
 * @param {string} categoryId The category ID.
 * @param {string} [sort] The sort order for the category.
 * @return {Function} The dispatched action.
 */
function fetchCategoryOrRootCategories(categoryId, sort) {
  return (dispatch) => {
    if (!categoryId) {
      dispatch(fetchRootCategories());
      return;
    }

    dispatch(fetchCategory(categoryId, sort));
  };
}

export default mutable(fetchCategoryOrRootCategories);
