import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { ACTION_PUSH, ACTION_REPLACE } from '@virtuous/conductor';
import { buildFetchSearchResultsParams, getProductsResult } from '@shopgate/engage/product';
import {
  searchWillEnter$,
  searchDidEnter$, searchProductsNeedUpdate$,
} from '@shopgate/pwa-common-commerce/search/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import expireProductsByHash from '@shopgate/pwa-common-commerce/product/action-creators/expireProductsByHash';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import {
  searchRequesting$,
  searchReceived$,
  searchFiltersDidUpdateFromFilterPage$,
} from '../streams';
import { SEARCH_PATTERN } from '../constants';

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

  subscribe(searchWillEnter$, ({ action, dispatch, getState }) => {
    if (![ACTION_PUSH, ACTION_REPLACE].includes(action?.historyAction)) {
      return;
    }

    const { filters } = action.route.state;
    const { s: searchPhrase, sort } = action.route.query;

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
  });

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

  subscribe(searchDidEnter$, ({ dispatch }) => {
    dispatch(fetchFilters());
  });

  subscribe(searchFiltersDidUpdateFromFilterPage$, ({ dispatch, action }) => {
    const { filters } = action.route.state;
    const { s: searchPhrase, sort } = action.route.query;

    dispatch(fetchSearchResults({
      filters,
      searchPhrase,
      sort,
      ...buildFetchSearchResultsParams(),
    }));
  });
}
