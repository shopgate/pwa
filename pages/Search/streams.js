import { filtersDidUpdate$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { preferredLocationDidUpdate$ } from '@shopgate/engage/locations';

export const searchFiltersDidUpdate$ = filtersDidUpdate$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === SEARCH_PATH);
  });

export const searchProductsNeedUpdate$ = filtersDidUpdate$
  .merge(preferredLocationDidUpdate$)
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === SEARCH_PATH);
  });
