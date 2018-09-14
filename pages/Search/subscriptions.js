import {
  searchWillEnter$,
  searchDidEnter$,
  searchWillLeave$,
} from '@shopgate/pwa-common-commerce/search/streams';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import setTitle from '@shopgate/pwa-common/actions/view/setTitle';
import getSearchResults from '@shopgate/pwa-common-commerce/search/actions/getSearchResults';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';
import { toggleProgressBar } from 'Components/Navigator/action-creators';
import { searchFiltersDidUpdate$ } from './streams';

/**
 * Filter subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchWillEnter$, ({ action, dispatch }) => {
    const { s: searchPhrase } = action.route.query;
    dispatch(getSearchResults(searchPhrase));
    dispatch(setTitle(searchPhrase));
    dispatch(toggleProgressBar(false));
  });

  subscribe(searchFiltersDidUpdate$, ({ dispatch }) => {
    const { query } = getCurrentRoute();
    const { s: searchPhrase } = query;
    dispatch(getSearchResults(searchPhrase));
  });

  subscribe(searchDidEnter$, ({ dispatch }) => {
    dispatch(getFilters());
  });

  subscribe(searchWillLeave$, ({ dispatch }) => {
    dispatch(toggleProgressBar(true));
  });
}
