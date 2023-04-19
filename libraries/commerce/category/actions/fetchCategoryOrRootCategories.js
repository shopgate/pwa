import { mutable } from '@shopgate/pwa-common/helpers/redux';
import fetchRootCategories from './fetchRootCategories';
import fetchCategory from './fetchCategory';

/**
 * Retrieves a category from the server when a categoryId is given. Otherwise it will fetch the
 * root categories.
 * @param {string} categoryId The category ID.
 * @return {Function} The dispatched action.
 */
function fetchCategoryOrRootCategories(categoryId) {
  return (dispatch) => {
    if (!categoryId) {
      dispatch(fetchRootCategories());
      return;
    }

    dispatch(fetchCategory(categoryId));
  };
}

export default mutable(fetchCategoryOrRootCategories);
