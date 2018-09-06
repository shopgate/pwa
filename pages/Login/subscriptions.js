import { errorManager, EINVALIDCREDENTIALS, SHOPGATE_USER_LOGIN_USER } from '@shopgate/pwa-core';
import { appWillStart$ } from '@shopgate/pwa-common/streams';
import { toggleLogin } from 'Components/Navigator/action-creators';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';
import disableNavigatorTitle from 'Components/Navigator/actions/disableNavigatorTitle';
import enableNavigatorTitle from 'Components/Navigator/actions/enableNavigatorTitle';
import toggleCartIcon from 'Components/Navigator/actions/toggleCartIcon';
import { loginWillEnter$, loginWillLeave$ } from './streams';

/**
 * Login subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function login(subscribe) {
  subscribe(appWillStart$, () => {
    // Translate some error messages
    errorManager.setMessage({
      code: EINVALIDCREDENTIALS,
      context: SHOPGATE_USER_LOGIN_USER,
      message: 'login.error',
    });
  });

  subscribe(loginWillEnter$, ({ dispatch }) => {
    dispatch(toggleLogin(true));
    dispatch(disableNavigatorTitle());
    dispatch(disableNavigatorSearch());
    dispatch(toggleCartIcon(false));
  });

  subscribe(loginWillLeave$, ({ dispatch }) => {
    dispatch(toggleLogin(false));
    dispatch(enableNavigatorTitle());
    dispatch(enableNavigatorSearch());
    dispatch(toggleCartIcon(true));
  });
}
