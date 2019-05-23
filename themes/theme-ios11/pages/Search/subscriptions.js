import {
  searchWillEnter$,
  searchDidEnter$,
} from '@shopgate/engage/search';
import { getCurrentRoute } from '@shopgate/engage/core';
import { fetchSearchResults } from '@shopgate/engage/search';
import { fetchFilters } from '@shopgate/engage/filter';
import { searchFiltersDidUpdate$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchWillEnter$, ({ action, dispatch }) => {
    const { filters } = action.route.state;
    const { s: searchPhrase, sort } = action.route.query;

    dispatch(fetchSearchResults({
      filters,
      searchPhrase,
      sort,
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
    }));
  });

  subscribe(searchDidEnter$, ({ dispatch }) => {
    dispatch(fetchFilters());
  });
}
