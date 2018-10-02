import { ProgressBar } from '@shopgate/pwa-ui-shared';
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
    ProgressBar.show(SEARCH_PATTERN);
  });

  subscribe(searchReceived$, () => {
    ProgressBar.hide(SEARCH_PATTERN);
  });
}
