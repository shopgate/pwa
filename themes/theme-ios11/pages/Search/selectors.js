import { createSelector } from 'reselect';
import { hasActiveFilters } from '@shopgate/pwa-common-commerce/filter/selectors';
import { getResultByHash } from '@shopgate/pwa-common-commerce/product/selectors/product';

export const showNoResults = createSelector(
  (state, props = {}) => props.searchPhrase,
  getResultByHash,
  (searchPhrase, results) => {
    // Search results are not requested for empty search phrases, so there will never be a result.
    if (!searchPhrase) {
      return true;
    }

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

export const showFilterBar = createSelector(
  hasActiveFilters,
  showNoResults,
  (hasFilters, hasNoResults) => {
    if (!hasFilters && hasNoResults) {
      return false;
    }

    return true;
  }
);
