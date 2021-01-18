import { ACTION_PUSH, ACTION_REPLACE } from '@virtuous/conductor';
import { buildFetchSearchResultsParams, getProductsResult } from '@shopgate/engage/product';
import {
  searchWillEnter$,
  searchDidEnter$,
} from '@shopgate/pwa-common-commerce/search/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import expireProductsByHash from '@shopgate/pwa-common-commerce/product/action-creators/expireProductsByHash';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
import { searchProductsNeedUpdate$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchWillEnter$, ({ action, dispatch, getState }) => {
    if (![ACTION_PUSH, ACTION_REPLACE].includes(action?.historyAction)) {
      return;
    }

    const { filters } = action.route.state;
    const { s: searchPhrase, sort } = action.route.query;

    const { hash, expired } = getProductsResult(getState(), { searchPhrase });

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

  subscribe(searchProductsNeedUpdate$, ({ action, dispatch, getState }) => {
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
