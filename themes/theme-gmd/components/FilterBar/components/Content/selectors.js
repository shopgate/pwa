import { createSelector } from 'reselect';
import {
  getCategoryProductCount,
  getCategoryChildCount,
} from '@shopgate/pwa-common-commerce/category/selectors';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
  * Checks if the filter bar is shown within a category page
  * @return {bool}
  */
export const isFilterBarShown = createSelector(
  getCategoryChildCount,
  getCategoryProductCount,
  hasActiveFilters,
  getProductsResult,
  (subCategories, categoryProductCount, activeFilters, { totalProductCount }) => {
    const hasProducts = (totalProductCount === null && categoryProductCount > 0) ||
       totalProductCount > 0;

    return !subCategories && (hasProducts || activeFilters);
  }
);
