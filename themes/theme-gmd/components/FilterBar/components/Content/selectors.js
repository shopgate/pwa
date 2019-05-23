import { createSelector } from 'reselect';
import {
  getCategoryProductCount,
  getCurrentCategoryChildCount,
} from '@shopgate/engage/category';
import { getProductsResult } from '@shopgate/engage/product';
import { hasActiveFilters } from '@shopgate/engage/filter';

/**
  * Checks if the filter bar is shown within a category page
  * @return {bool}
  */
export const isFilterBarShown = createSelector(
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
