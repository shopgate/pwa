import { REQUEST_CATEGORY_CHILDREN } from '../constants';

/**
 * Dispatches the REQUEST_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to request children for.
 * @param {string} [sort] the selected sort order
 * @return {Object} The REQUEST_CATEGORY_CHILDREN action.
 */
const requestCategoryChildren = (categoryId, sort) => ({
  type: REQUEST_CATEGORY_CHILDREN,
  categoryId,
  sort,
});

export default requestCategoryChildren;
