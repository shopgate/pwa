import { ERROR_CATEGORY_CHILDREN } from '../constants';

/**
 * Dispatches the ERROR_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to receive children for.
 * @return {Object} The ERROR_CATEGORY_CHILDREN action.
 */
const errorCategoryChildren = categoryId => ({
  type: ERROR_CATEGORY_CHILDREN,
  categoryId,
});

export default errorCategoryChildren;
