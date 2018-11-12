import {
  searchWillEnter$,
  searchDidEnter$,
} from '@shopgate/pwa-common-commerce/search/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/helpers/router';
import getSearchResults from '@shopgate/pwa-common-commerce/search/actions/getSearchResults';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';
import { searchFiltersDidUpdate$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchWillEnter$, ({ action, dispatch }) => {
    const { filters } = action.route.state;
    const { s: searchPhrase, sort } = action.route.query;

    dispatch(getSearchResults({
      filters,
      searchPhrase,
      sort,
    }));
  });

  subscribe(searchFiltersDidUpdate$, ({ action, dispatch }) => {
    const { filters } = action;
    const { query } = getCurrentRoute();
    const { s: searchPhrase, sort } = query;

    dispatch(getSearchResults({
      filters,
      searchPhrase,
      sort,
    }));
  });

  subscribe(searchDidEnter$, ({ dispatch }) => {
    dispatch(getFilters());
  });
}
