import { createSelector } from 'reselect';
import { getCategoryProductCount, getCurrentCategories } from '@shopgate/pwa-common-commerce/category/selectors';
import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Selects the summed up shipping costs of the cart.
 * @type {number}
 */
export const isFilterBarActive = createSelector(
  hasActiveFilters,
  activeFilters => activeFilters
);

/**
 * Selects the summed up shipping costs of the cart.
 * @type {number}
 */
export const isFilterBarShown = createSelector(
  getCurrentCategories,
  hasActiveFilters,
  getCategoryProductCount,
  (category, activeFilters, productCount) => {
    if (
      !(category && category.categories && category.categories.length) &&
      (activeFilters || productCount > 0)
    ) {
      return true;
    }

    return false;
  }
);
