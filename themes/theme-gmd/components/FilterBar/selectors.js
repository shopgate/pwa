import { createSelector } from 'reselect';
import { hasActiveFilters } from '@shopgate/engage/filter';

/**
 * Checks if the filter bar has active filters
 * @return {bool}
 */
export const isFilterBarActive = createSelector(
  hasActiveFilters,
  activeFilters => activeFilters
);
