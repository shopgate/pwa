import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { ACTION_PUSH, ACTION_REPLACE } from '@virtuous/conductor';
import { buildFetchSearchResultsParams, getProductsResult } from '@shopgate/engage/product';
import { hex2bin, router } from '@shopgate/engage/core';
import {
  CATEGORY_ALL_PATTERN,
  fetchCategory,
  getShowAllProductsFilters,
} from '@shopgate/engage/category';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import expireProductsByHash from '@shopgate/pwa-common-commerce/product/action-creators/expireProductsByHash';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import {
  buildFilterParamsForFetchFiltersRequest,
} from '@shopgate/engage/filter/helpers';
import {
  categoryAllWillEnter$,
  categoryAllFiltersDidUpdateFromFilterPage$,
} from '@shopgate/pwa-common-commerce/category/streams';
import {
  searchWillEnter$,
  searchFiltersDidUpdateFromFilterPage$,
  searchRequesting$,
  searchReceived$,
  searchProductsNeedUpdate$,
} from '../streams';
import { SEARCH_PATTERN } from '../constants';

const searchBasedRouteWillEnter$ = searchWillEnter$.merge(categoryAllWillEnter$);
const searchBasedFiltersDidUpdateFromFilterPage$ = searchFiltersDidUpdateFromFilterPage$.merge(
  categoryAllFiltersDidUpdateFromFilterPage$
);

/**
 * Search subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchRequesting$, () => {
    LoadingProvider.setLoading(SEARCH_PATTERN);
  });

  subscribe(searchReceived$, () => {
    LoadingProvider.unsetLoading(SEARCH_PATTERN);
  });

  subscribe(searchBasedRouteWillEnter$, async ({ action, dispatch, getState }) => {
    if (![ACTION_PUSH, ACTION_REPLACE].includes(action?.historyAction)) {
      return;
    }

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

    const { hash, expired } = getProductsResult(getState(), {
      searchPhrase,
      routeId: action?.route?.id,
      ...buildFetchSearchResultsParams(),
    });

    if (expired) {
      dispatch(expireProductsByHash(hash));
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

  // No logic related to "show all products" necessary here, since stream only emits when
  // location based shopping is active. That's currently only supported when new services are
  // used, but the new services don't support "show all products".
  subscribe(searchProductsNeedUpdate$, ({ dispatch, getState }) => {
    const { query, state: { filters } } = getCurrentRoute(getState());
    const { s: searchPhrase, sort } = query;

    dispatch(fetchSearchResults({
      filters,
      searchPhrase,
      sort,
      ...buildFetchSearchResultsParams(),
    }));
  });

  subscribe(searchBasedFiltersDidUpdateFromFilterPage$, ({ dispatch, action }) => {
    const { filters } = action.route.state;
    const { pattern } = action.route;
    const { sort } = action.route.query;
    let { s: searchPhrase } = action.route.query;

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
