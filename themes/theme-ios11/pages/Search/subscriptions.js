import { buildFetchSearchResultsParams } from '@shopgate/engage/product';
import { hex2bin, router } from '@shopgate/engage/core';
import {
  CATEGORY_ALL_PATTERN,
  fetchCategory,
  getShowAllProductsFilters,
} from '@shopgate/engage/category';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import {
  buildFilterParamsForFetchFiltersRequest,
} from '@shopgate/engage/filter';
import {
  searchFiltersDidUpdate$,
  searchPageComponentWillEnter$,
} from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchPageComponentWillEnter$, async ({ action, dispatch }) => {
    let { filters } = action.route.state;
    let { s: searchPhrase } = action.route.query;
    const { sort } = action.route.query;

    if (action.route.pattern === CATEGORY_ALL_PATTERN) {
      searchPhrase = '*';

      if (!filters) {
        const category = await dispatch(fetchCategory(hex2bin(action.route.params.categoryId)));

        filters = getShowAllProductsFilters(category);

        router.update(
          action.route.id,
          {
            filters,
            categoryName: category.name,
          }
        );
      }
    }

    dispatch(fetchSearchResults({
      filters,
      searchPhrase,
      sort,
      ...buildFetchSearchResultsParams(),
    }));

    dispatch(fetchFilters({
      filters: buildFilterParamsForFetchFiltersRequest(filters),
    }));
  });

  subscribe(searchFiltersDidUpdate$, ({ action, dispatch, getState }) => {
    const { filters } = action;
    const { query, pattern } = getCurrentRoute(getState());
    let { s: searchPhrase } = query;
    const { sort } = query;

    if (pattern === CATEGORY_ALL_PATTERN) {
      searchPhrase = '*';
    }

    dispatch(fetchSearchResults({
      filters,
      searchPhrase,
      sort,
      ...buildFetchSearchResultsParams(),
    }));
  });
}
