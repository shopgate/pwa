import { REQUEST_CATEGORY_CHILDREN } from '../constants';

/**
 * Dispatches the REQUEST_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to request children for.
 * @return {Object} The REQUEST_CATEGORY_CHILDREN action.
 */
const requestCategoryChildren = categoryId => ({
  type: REQUEST_CATEGORY_CHILDREN,
  categoryId,
});

export default requestCategoryChildren;
