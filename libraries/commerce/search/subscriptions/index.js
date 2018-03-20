import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
import {
  searchRequesting$,
  searchReceived$,
} from '../streams';
import { SEARCH_PATH } from '../constants';

/**
 * Search subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function search(subscribe) {
  subscribe(searchRequesting$, ({ dispatch }) => {
    dispatch(setViewLoading(SEARCH_PATH));
  });

  subscribe(searchReceived$, ({ dispatch }) => {
    dispatch(unsetViewLoading(SEARCH_PATH));
  });
}
