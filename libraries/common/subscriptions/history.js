import { event } from '@shopgate/pwa-core';
import { ACTION_RESET } from '@virtuous/conductor/constants';
import {
  routeDidChange$,
  routeDidLeave$,
  routeDidEnter$,
  userDidLogout$,
} from '../streams';
import { navigate, setRedirectLocation } from '../action-creators';
import { LOGIN_PATH, REGISTER_PATH } from '../constants/RoutePaths';

/**
 * History subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function history(subscribe) {
  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(navigate(ACTION_RESET));
  });

  const loginRouteDidLeave$ = routeDidLeave$
    .filter(({ action }) => action.route.pattern === LOGIN_PATH)
    .zip(routeDidEnter$.filter(({ action }) => action.route.pattern !== REGISTER_PATH));

  subscribe(loginRouteDidLeave$, ({ dispatch }) => {
    dispatch(setRedirectLocation(null));
  });

  subscribe(routeDidChange$, () => {
    event.trigger('routeDidChange');
  });
}
