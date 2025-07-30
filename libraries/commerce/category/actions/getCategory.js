import { logDeprecationMessage } from '@shopgate/pwa-core/helpers';
import fetchCategoryOrRootCategories from './fetchCategoryOrRootCategories';

/**
 * Deprecation fallback for the fetchCategoryOrRootCategories action
 * @deprecated
 * @param {string} categoryId The category ID.
 * @param {boolean} [includeChildren] whether children should be fetched
 * @param {string} [sort] The sort parameter
 * @return {Function} The dispatched action.
 */
const getCategory = (categoryId, includeChildren, sort) => {
  logDeprecationMessage('The fetch action getCategory will be removed in future versions due naming conflict with getCategory selector. Please use fetchCategoryOrRootCategories as a replacement');

  return fetchCategoryOrRootCategories(categoryId, sort);
};

export default getCategory;
