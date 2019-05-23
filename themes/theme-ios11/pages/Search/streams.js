import { filtersDidUpdate$ } from '@shopgate/engage/filter';
import { SEARCH_PATH } from '@shopgate/engage/search';
import { getCurrentRoute } from '@shopgate/engage/core';

export const searchFiltersDidUpdate$ = filtersDidUpdate$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === SEARCH_PATH);
  });
