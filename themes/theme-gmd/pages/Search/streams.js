import { filtersDidUpdate$ } from '@shopgate/pwa-common-commerce/filter/streams';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { router } from '@virtuous/conductor';

export const searchFiltersDidUpdate$ = filtersDidUpdate$
  .filter(() => {
    const { pattern } = router.getCurrentRoute();
    return (pattern === SEARCH_PATH);
  });
