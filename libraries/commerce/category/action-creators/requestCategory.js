import { REQUEST_CATEGORY } from '../constants';

/**
 * Dispatches the REQUEST_CATEGORY action.
 * @param {string} categoryId The ID of the category to be requested.
 * @param {string} sort the selected sort order
 * @return {Object} The REQUEST_CATEGORY action.
 */
const requestCategory = (categoryId, sort) => ({
  type: REQUEST_CATEGORY,
  categoryId,
  sort,
});

export default requestCategory;
