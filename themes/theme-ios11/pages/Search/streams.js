import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { filtersDidUpdate$ } from '@shopgate/pwa-common-commerce/filter/streams';
import {
  CATEGORY_ALL_PATTERN,
  categoryAllWillEnter$,
} from '@shopgate/engage/category';
import {
  SEARCH_PATH,
  searchWillEnter$,
} from '@shopgate/engage/search';

export const searchFiltersDidUpdate$ = filtersDidUpdate$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === SEARCH_PATH || pattern === CATEGORY_ALL_PATTERN);
  });

export const searchPageComponentWillEnter$ = searchWillEnter$.merge(
  categoryAllWillEnter$
);
