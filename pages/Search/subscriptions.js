import {
  searchWillEnter$,
  searchDidEnter$,
} from '@shopgate/pwa-common-commerce/search/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import fetchSearchResults from '@shopgate/pwa-common-commerce/search/actions/fetchSearchResults';
import fetchFilters from '@shopgate/pwa-common-commerce/filter/actions/fetchFilters';
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

  subscribe(searchFiltersDidUpdate$, ({ action, dispatch }) => {
    const { filters } = action;
    const { query } = getCurrentRoute();
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
