import { event } from '@shopgate/pwa-core';
import { hasWebBridge, INDEX_PATH } from '@shopgate/engage/core';
import {
  routeDidChange$,
  userDidLogout$,
} from '../streams';
import { historyReset, historyResetTo } from '../actions/router';

/**
 * History subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function history(subscribe) {
  subscribe(userDidLogout$, ({ dispatch }) => {
    if (hasWebBridge()) {
      // Within the website there is no guarantee that the index page is the first stack entry
      dispatch(historyResetTo(INDEX_PATH));
    } else {
      dispatch(historyReset());
    }
  });

  /**
   * @deprecated Will be removed in Next versions
   */
  subscribe(routeDidChange$, () => {
    event.trigger('routeDidChange');
  });
}
