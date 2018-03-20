import { RECEIVE_CATEGORY_CHILDREN } from '../constants';

/**
 * Dispatches the RECEIVE_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to receive children for.
 * @param {Array} categoryChildren The requested category children.
 * @return {Object} The RECEIVE_CATEGORY_CHILDREN action.
 */
const receiveCategoryChildren = (categoryId, categoryChildren) => ({
  type: RECEIVE_CATEGORY_CHILDREN,
  categoryId,
  categoryChildren,
});

export default receiveCategoryChildren;
