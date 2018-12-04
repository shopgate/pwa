import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import { filtersDidUpdate$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';

export const searchFiltersDidUpdate$ = filtersDidUpdate$
  .filter(() => {
    const { pattern } = getCurrentRoute();
    return (pattern === SEARCH_PATH);
  });
