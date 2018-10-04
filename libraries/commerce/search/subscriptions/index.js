import { ProgressBar } from '@shopgate/pwa-ui-shared';
import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
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
    ProgressBar.show(SEARCH_PATTERN);
    dispatch(setViewLoading(SEARCH_PATTERN));
  });

  subscribe(searchReceived$, ({ dispatch }) => {
    ProgressBar.hide(SEARCH_PATTERN);
    dispatch(unsetViewLoading(SEARCH_PATTERN));
  });
}
