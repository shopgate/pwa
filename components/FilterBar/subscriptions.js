import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';

/**
 * Navigator subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filterbar(subscribe) {
  // Derived streams.
  const searchRouteDidEnter$ = routeDidEnter(SEARCH_PATH);

  /**
   * Gets triggered on entering the search route.
   */
  subscribe(searchRouteDidEnter$, ({ dispatch }) => {
    dispatch(getFilters());
  });
}
