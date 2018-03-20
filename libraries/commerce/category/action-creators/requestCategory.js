import { REQUEST_CATEGORY } from '../constants';

/**
 * Dispatches the REQUEST_CATEGORY action.
 * @param {string} categoryId The ID of the category to be requested.
 * @return {Object} The REQUEST_CATEGORY action.
 */
const requestCategory = categoryId => ({
  type: REQUEST_CATEGORY,
  categoryId,
});

export default requestCategory;
