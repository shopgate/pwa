import { buildFetchSearchResultsParams } from '@shopgate/engage/product';
import {
  searchWillEnter$,
  searchDidEnter$,
} from '@shopgate/pwa-common-commerce/search/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin, router } from '@shopgate/engage/core';
import { CATEGORY_ALL_PATTERN } from '@shopgate/engage/category';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchCategory from '@shopgate/pwa-common-commerce/category/actions/fetchCategory';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import { searchFiltersDidUpdate$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchWillEnter$, async ({ action, dispatch }) => {
    let { filters } = action.route.state;
    let { s: searchPhrase } = action.route.query;
    const { sort } = action.route.query;

    if (action.route.pattern === CATEGORY_ALL_PATTERN) {
      searchPhrase = '*';

      if (!filters) {
        const category = await dispatch(fetchCategory(hex2bin(action.route.params.categoryId)));

        filters = {
          categories: {
            id: 'categories',
            label: 'Kategorie',
            source: 'categories',
            type: 'multiselect',
            value: [{
              id: category.path,
              label: category.name,
            }],
          },
        };

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
  });

  subscribe(searchFiltersDidUpdate$, ({ action, dispatch, getState }) => {
    const { filters } = action;
    const { query } = getCurrentRoute(getState());
    const { s: searchPhrase, sort } = query;

    dispatch(fetchSearchResults({
      filters,
      searchPhrase,
      sort,
      ...buildFetchSearchResultsParams(),
    }));
  });

  subscribe(searchDidEnter$, ({ dispatch }) => {
    dispatch(fetchFilters());
  });
}
