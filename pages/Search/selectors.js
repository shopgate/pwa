import { createSelector } from 'reselect';
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
