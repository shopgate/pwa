import { event } from '@shopgate/pwa-core';
import { ACTION_RESET } from '@virtuous/conductor/constants';
import {
  routeDidChange$,
  userDidLogout$,
} from '../streams';
import { navigate } from '../action-creators';

/**
 * History subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function history(subscribe) {
  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(navigate(ACTION_RESET));
  });

  subscribe(routeDidChange$, () => {
    event.trigger('routeDidChange');
  });
}
