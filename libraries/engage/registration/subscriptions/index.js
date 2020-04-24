import {
  main$, makeGetPrevRoute, getCurrentRoute, historyPop,
} from '@shopgate/engage/core';
import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { successLogin } from '@shopgate/pwa-common/action-creators';
import { SUCCESS_REGISTRATION } from '../constants';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function registration(subscribe) {
  const registrationSuccess$ = main$
    .filter(({ action }) => action.type === SUCCESS_REGISTRATION);

  subscribe(registrationSuccess$, ({ dispatch, getState }) => {
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
    dispatch(successLogin(redirect));
  });
}

