import { createSelector } from 'reselect';
import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import { getResultByHash } from '@shopgate/pwa-common-commerce/product/selectors/product';

export const showNoResults = createSelector(
  getResultByHash,
  (results) => {
    if (results === null) {
      return false;
    }

    if (results && results.isFetching) {
      return false;
    }

    if (results && !results.isFetching && (results.products && results.products.length > 0)) {
      return false;
    }

    return true;
  }
);

export const areResultsFetching = createSelector(
  getResultByHash,
  (results) => {
    if (!results || results.isFetching) {
      return true;
    }

    return false;
  }
);

export const showFilterBar = createSelector(
  hasActiveFilters,
  areResultsFetching,
  showNoResults,
  (hasFilters, isFetching, hasResults) => {
    if (isFetching) {
      return false;
    }

    if (!hasFilters && hasResults) {
      return false;
    }

    return true;
  }
);
