import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import { LoadingProvider } from '../providers';
import { fetchUser } from '../actions/user';
import { successLogin } from '../action-creators';
import { historyPush } from '../actions/router';
import logout from '../actions/user/logout';
import {
  appDidStart$,
  userWillLogin$,
  userLoginResponse$,
  userDidLogin$,
  userDidLogout$,
  userDidInitialize$,
  legacyConnectRegisterDidFail$,
  userSessionExpired$,
} from '../streams';
import showModal from '../actions/modal/showModal';
import { LOGIN_PATH } from '../constants/RoutePaths';
import { LEGACY_URL_CONNECT_REGISTER } from '../constants/Registration';
import { EVENT_USER_INITIALIZED } from '../constants/user';

/**
 * User subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function user(subscribe) {
  /**
   * Gets triggered when ever the user data need to be updated.
   */
  const userNeedsUpdate$ = appDidStart$.merge(userDidLogin$);

  subscribe(userDidInitialize$, ({ events }) => {
    events.emit(EVENT_USER_INITIALIZED);
  });

  subscribe(userWillLogin$, () => {
    LoadingProvider.setLoading(LOGIN_PATH);
  });

  subscribe(userLoginResponse$, () => {
    LoadingProvider.unsetLoading(LOGIN_PATH);
  });

  subscribe(userNeedsUpdate$, ({ dispatch }) => {
    dispatch(fetchUser());
  });

  subscribe(userDidLogout$, async ({ dispatch, action }) => {
    if (action.notify === false) {
      return;
    }

    const isAutoLogout = action.autoLogout;

    const confirmed = await dispatch(showModal({
      confirm: 'modal.ok',
      dismiss: null,
      message: 'login.logout_message',
      title: null,
      ...(isAutoLogout ? {
        message: 'login.auto_logout_message',
        confirm: 'modal.login',
        dismiss: 'modal.close',
      } : null),
    }));

    if (isAutoLogout && confirmed) {
      dispatch(historyPush({
        pathname: LOGIN_PATH,
      }));
    }
  });

  subscribe(appDidStart$, ({ dispatch, getState }) => {
    registerEvents(['userLoggedIn']);

    event.addCallback('userLoggedIn', () => {
      const { state: { redirect } = {} } = getCurrentRoute(getState());
      dispatch(successLogin(redirect));
    });
  });

  subscribe(legacyConnectRegisterDidFail$, ({ dispatch }) => {
    dispatch(historyPush({
      pathname: LEGACY_URL_CONNECT_REGISTER,
    }));
  });

  subscribe(userSessionExpired$, ({ dispatch }) => {
    dispatch(logout(undefined, true));
  });
}
