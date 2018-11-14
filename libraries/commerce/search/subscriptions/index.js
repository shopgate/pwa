import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
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
  subscribe(searchRequesting$, ({ dispatch }) => {
    LoadingProvider.setLoading(SEARCH_PATTERN);
    dispatch(setViewLoading(SEARCH_PATTERN));
  });

  subscribe(searchReceived$, ({ dispatch }) => {
    LoadingProvider.unsetLoading(SEARCH_PATTERN);
    dispatch(unsetViewLoading(SEARCH_PATTERN));
  });
}
