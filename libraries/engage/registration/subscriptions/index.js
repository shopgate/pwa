import {
  makeGetPrevRoute, getCurrentRoute, historyPop,
} from '@shopgate/engage/core';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { REGISTRATION_FORM_LOGIN_STRATEGY } from '@shopgate/pwa-common/constants/user';
import { successLogin } from '@shopgate/pwa-common/action-creators';
import { registrationSuccess$ } from '../streams';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function registration(subscribe) {
  subscribe(registrationSuccess$, ({ dispatch, getState, action }) => {
    const currentRoute = getCurrentRoute(getState());
    let redirect;

    if (currentRoute) {
      // Try to get the login page from the router stack to extract the original redirect target
      const getPrevRoute = makeGetPrevRoute();
      const { id: routeId } = currentRoute;
      const { pattern, state } = getPrevRoute(getState(), { routeId }) || {};

      if (pattern === LOGIN_PATH && state?.redirect) {
        ({ redirect } = state);
      }
    }

    // TODO improve navigation since the login page will be briefly visible
    dispatch(historyPop());
    dispatch(successLogin(
      redirect,
      REGISTRATION_FORM_LOGIN_STRATEGY,
      action?.response?.sessionLifetimeInSeconds
    ));
  });
}

