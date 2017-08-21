import fetchRootCategories from './fetchRootCategories';
import fetchCategory from './fetchCategory';

/**
 * Retrieves a category from store.
 * @param {string} categoryId The category ID.
 * @return {Function} The dispatched action.
 */
const getCategory = categoryId => (dispatch) => {
  if (!categoryId) {
    dispatch(fetchRootCategories());
    return;
  }

  dispatch(fetchCategory(categoryId));
};

export default getCategory;
