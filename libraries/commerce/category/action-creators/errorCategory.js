import { ERROR_CATEGORY } from '../constants';

/**
 * Dispatches the ERROR_CATEGORY action.
 * @param {string} categoryId The ID of the received category.
 * @return {Object} The ERROR_CATEGORY action.
 */
const errorCategory = categoryId => ({
  type: ERROR_CATEGORY,
  categoryId,
});

export default errorCategory;
