import { ERROR_ROOT_CATEGORIES } from '../constants';

/**
 * Dispatches the ERROR_ROOT_CATEGORIES action.
 * @return {Object} The ERROR_ROOT_CATEGORIES action.
 */
const errorRootCategories = () => ({
  type: ERROR_ROOT_CATEGORIES,
});

export default errorRootCategories;
