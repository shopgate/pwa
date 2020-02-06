import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import { LoadingProvider } from '../providers';
import { fetchUser } from '../actions/user';
import { successLogin } from '../action-creators';
import { historyPush } from '../actions/router';
import {
  appDidStart$,
  userWillLogin$,
  userLoginResponse$,
  userDidLogin$,
  userDidLogout$,
  legacyConnectRegisterDidFail$,
} from '../streams';
import showModal from '../actions/modal/showModal';
import { LOGIN_PATH } from '../constants/RoutePaths';
import { LEGACY_URL_CONNECT_REGISTER } from '../constants/Registration';

/**
 * User subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function user(subscribe) {
  /**
   * Gets triggered when ever the user data need to be updated.
   */
  const userNeedsUpdate$ = appDidStart$.merge(userDidLogin$);

  subscribe(userWillLogin$, () => {
    LoadingProvider.setLoading(LOGIN_PATH);
  });

  subscribe(userLoginResponse$, () => {
    LoadingProvider.unsetLoading(LOGIN_PATH);
  });

  subscribe(userNeedsUpdate$, ({ dispatch }) => {
    dispatch(fetchUser());
  });

  subscribe(userDidLogout$, ({ dispatch, action }) => {
    if (action.notify === false) {
      return;
    }

    dispatch(showModal({
      confirm: 'modal.ok',
      dismiss: null,
      message: 'login.logout_message',
      title: null,
    }));
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
}
