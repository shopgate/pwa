import { createSelector } from 'reselect';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Checks if the filter bar is shown within a search page
 * @return {bool}
 */
export const isFilterBarShown = createSelector(
  hasActiveFilters,
  getProductsResult,
  (activeFilters, { totalProductCount }) =>
    totalProductCount === null || (totalProductCount > 0 || activeFilters)
);
