import { LoadingProvider } from '@shopgate/pwa-common/providers';
import {
  searchRequesting$,
  searchReceived$,
} from '../streams';
import { SEARCH_PATTERN } from '../constants';

/**
 * Search subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchRequesting$, () => {
    LoadingProvider.setLoading(SEARCH_PATTERN);
  });

  subscribe(searchReceived$, () => {
    LoadingProvider.unsetLoading(SEARCH_PATTERN);
  });
}
