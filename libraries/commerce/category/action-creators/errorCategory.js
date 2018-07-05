import { ERROR_CATEGORY } from '../constants';

/**
 * Dispatches the ERROR_CATEGORY action.
 * @param {string} categoryId The ID of the received category.
 * @param {string} errorCode The error code.
 * @return {Object} The ERROR_CATEGORY action.
 */
const errorCategory = (categoryId, errorCode) => ({
  type: ERROR_CATEGORY,
  categoryId,
  errorCode,
});

export default errorCategory;
