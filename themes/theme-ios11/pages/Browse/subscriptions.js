import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { setSearchPhrase } from 'Components/Navigator/action-creators';
import { BROWSE_PATH } from './constants';

/**
 * Search subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function browse(subscribe) {
  // Derived streams.
  const browseRouteDidEnter$ = routeDidEnter(BROWSE_PATH);

  /**
   * Gets triggered on entering the browse route. Resets the search phrase.
   */
  subscribe(browseRouteDidEnter$, ({ dispatch }) => dispatch(setSearchPhrase('')));
}
