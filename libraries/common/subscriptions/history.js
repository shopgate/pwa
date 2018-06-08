import event from '@shopgate/pwa-core/classes/Event/index';
import resetHistory from '../actions/history/resetHistory';
import {
  routeDidLeave,
  routeDidChange$,
} from '../streams/history';
import {
  userDidLogout$,
} from '../streams/user';
import { setRedirectLocation } from '../action-creators/history';
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '../constants/RoutePaths';

/**
 * History subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function history(subscribe) {
  /**
   * Gets triggered when the user did log out.
   */
  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(resetHistory());
  });

  /**
   * Gets triggered when the LOGIN_PATH is left but the REGISTER_PATH is not entered.
   */
  const loginRouteDidLeave$ = routeDidLeave(LOGIN_PATH).filter(({ pathname }) => (
    pathname !== REGISTER_PATH
  ));

  subscribe(loginRouteDidLeave$, ({ dispatch }) => {
    dispatch(setRedirectLocation(null));
  });

  subscribe(routeDidChange$, () => {
    event.trigger('routeDidChange');
  });
}
