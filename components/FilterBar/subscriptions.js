import { searchDidEnter$ } from '@shopgate/pwa-common-commerce/search/streams';
import getFilters from '@shopgate/pwa-common-commerce/filter/actions/getFilters';

/**
 * Navigator subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function filterbar(subscribe) {
  /**
   * Gets triggered on entering the search route.
   */
  subscribe(searchDidEnter$, ({ dispatch }) => {
    dispatch(getFilters());
  });
}
