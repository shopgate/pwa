import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { i18n } from '@shopgate/engage/core';
import { CATEGORY_PATH } from '../constants';

/**
 * Generate category route for navigation.
 * @param {string} id category Id
 * @returns {string}
 */
export const getCategoryRoute = id => `${CATEGORY_PATH}/${bin2hex(id)}`;

/**
 * Generate filters for show all products.
 * @param {Object} parentCategory parent category
 * @returns {Object}
 */
export const getShowAllProductsFilters = (parentCategory) => {
  const filters = {
    categories: {
      id: 'categories',
      label: i18n.text('filters.label.category'),
      source: 'categories',
      type: 'multiselect',
      value: [{
        id: parentCategory ? parentCategory.path : null,
        label: parentCategory ? parentCategory.name : null,
      }],
    },
  };

  return filters;
};

/**
 * Removes the categories filter from filters
 * @param {Object} filters filters
 * @returns {Object}
 */
export const removeCategoriesFilter = (filters) => {
  const clearedFilters = filters;

  if (Object.keys(clearedFilters).length > 1) {
    delete clearedFilters.categories;
  }

  return clearedFilters;
};

