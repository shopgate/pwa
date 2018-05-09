import event from '@shopgate/pwa-core/classes/Event/index';
import appConfig from '../helpers/config';
import redirectRoute from '../actions/history/redirectRoute';
import resetHistory from '../actions/history/resetHistory';
import {
  routeDidLeave,
  routeDidChange$,
} from '../streams/history';
import {
  userDidLogin$,
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
   * For the moment, we need to explicitly check for the Shopify webcheckout.
   * If it's there then we let that module handle the user login.
   */
  if (appConfig.webCheckoutShopify === null) {
    /**
     * Gets triggered when the user did log in.
     */
    subscribe(userDidLogin$, ({ dispatch }) => {
      dispatch(redirectRoute());
    });
  }

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
