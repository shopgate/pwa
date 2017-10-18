import { createSelector } from 'reselect';
import {
  getCategoryProductCount,
  getCurrentCategoryChildCount,
} from '@shopgate/pwa-common-commerce/category/selectors';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Checks if the filter bar has active filters
 * @return {bool}
 */
export const isFilterBarActive = createSelector(
  hasActiveFilters,
  activeFilters => activeFilters
);

/**
 * Checks if the filter bar is shown within a category page
 * @return {bool}
 */
export const isFilterBarShownInCategory = createSelector(
  getCurrentCategoryChildCount,
  getCategoryProductCount,
  hasActiveFilters,
  getProductsResult,
  (subCategories, categoryProductCount, activeFilters, { totalProductCount }) => {
    const hasProducts = (totalProductCount === null && categoryProductCount > 0) ||
      totalProductCount > 0;

    return !subCategories && (hasProducts || activeFilters);
  }
);

/**
 * Checks if the filter bar is shown within a search page
 * @return {bool}
 */
export const isFilterBarShownInSearch = createSelector(
  hasActiveFilters,
  getProductsResult,
  (activeFilters, { totalProductCount }) =>
    totalProductCount === null || (totalProductCount > 0 || activeFilters)
);
