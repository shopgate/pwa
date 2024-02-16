import { filtersDidUpdate$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { CATEGORY_ALL_PATTERN } from '@shopgate/engage/category';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';

export const searchFiltersDidUpdate$ = filtersDidUpdate$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === SEARCH_PATH || pattern === CATEGORY_ALL_PATTERN);
  });
