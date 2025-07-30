import { RECEIVE_CATEGORY_CHILDREN } from '../constants';

/**
 * Dispatches the RECEIVE_CATEGORY_CHILDREN action.
 * @param {string} categoryId The ID of the category to receive children for.
 * @param {Array} categoryChildren The requested category children.
 * @param {string} [sort] the selected sort order
 * @return {Object} The RECEIVE_CATEGORY_CHILDREN action.
 */
const receiveCategoryChildren = (categoryId, categoryChildren, sort) => ({
  type: RECEIVE_CATEGORY_CHILDREN,
  categoryId,
  categoryChildren,
  sort,
});

export default receiveCategoryChildren;
