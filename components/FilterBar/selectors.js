import { createSelector } from 'reselect';
import {
  getCategoryProductCount,
  getCurrentCategoryChildCount,
} from '@shopgate/pwa-common-commerce/category/selectors';
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
  getCurrentCategoryChildCount,
  hasActiveFilters,
  getCategoryProductCount,
  (childCategoryCount, activeFilters, productCount) => {
    if (
      !childCategoryCount &&
      (activeFilters || productCount > 0)
    ) {
      return true;
    }

    return false;
  }
);
