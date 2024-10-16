import { logDeprecationMessage } from '@shopgate/pwa-core/helpers';
import fetchCategoryOrRootCategories from './fetchCategoryOrRootCategories';

/**
 * Deprecation fallback for the fetchCategoryOrRootCategories action
 * @deprecated
 * @param {string} categoryId The category ID.
 * @return {Function} The dispatched action.
 */
const getCategory = (categoryId) => {
  logDeprecationMessage('The fetch action getCategory will be removed in future versions due naming conflict with getCategory selector. Please use fetchCategoryOrRootCategories as a replacement');

  return fetchCategoryOrRootCategories(categoryId);
};

export default getCategory;
