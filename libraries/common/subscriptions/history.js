import { event } from '@shopgate/pwa-core';
import {
  routeDidChange$,
  userDidLogout$,
} from '../streams';
import { historyReset } from '../actions/router';

/**
 * History subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function history(subscribe) {
  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(historyReset());
  });

  subscribe(routeDidChange$, () => {
    event.trigger('routeDidChange');
  });
}
