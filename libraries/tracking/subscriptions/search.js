import { getCurrentRoute } from '@shopgate/engage/core/selectors';
import { searchIsReady$ } from '../streams/search';
import getTrackingData from '../selectors/search';
import { track } from '../helpers/index';

/**
 * Search tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchIsReady$, ({ getState }) => {
    const state = getState();

    track('search', {
      search: getTrackingData(state, getCurrentRoute(state)),
    }, state);
  });
}
