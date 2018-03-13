import { REQUEST_ROOT_CATEGORIES } from '../constants';

/**
 * Dispatches the REQUEST_ROOT_CATEGORIES action.
 * @return {Object} The REQUEST_ROOT_CATEGORIES action.
 */
const requestRootCategories = () => ({
  type: REQUEST_ROOT_CATEGORIES,
});

export default requestRootCategories;
