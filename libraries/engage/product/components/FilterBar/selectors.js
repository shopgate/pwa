import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';

/**
 * Checks if the filter bar has active filters
 * @return {bool}
 */
export const isFilterBarActive = hasActiveFilters;
