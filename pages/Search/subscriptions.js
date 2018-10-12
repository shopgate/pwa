import {
  searchWillEnter$,
  searchDidEnter$,
} from '@shopgate/pwa-common-commerce/search/streams';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import getSearchResults from '@shopgate/pwa-common-commerce/search/actions/getSearchResults';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';
import { searchFiltersDidUpdate$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchWillEnter$, ({ action, dispatch }) => {
    const { s: searchPhrase, sort } = action.route.query;
    dispatch(getSearchResults({ searchPhrase, sort }));
  });

  subscribe(searchFiltersDidUpdate$, ({ dispatch }) => {
    const { query } = getCurrentRoute();
    const { s: searchPhrase, sort } = query;
    dispatch(getSearchResults({ searchPhrase, sort }));
  });

  subscribe(searchDidEnter$, ({ dispatch }) => {
    dispatch(getFilters());
  });
}
