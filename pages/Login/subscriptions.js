import { errorManager, EINVALIDCREDENTIALS, SHOPGATE_USER_LOGIN_USER } from '@shopgate/pwa-core';
import { appWillStart$ } from '@shopgate/pwa-common/streams';
import {
  toggleNavigatorCart,
  toggleNavigatorSearch,
  toggleNavigatorTitle,
} from 'Components/Navigator/action-creators';
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
    dispatch(toggleNavigatorTitle(false));
    dispatch(toggleNavigatorSearch(false));
    dispatch(toggleNavigatorCart(false));
  });

  subscribe(loginWillLeave$, ({ dispatch }) => {
    dispatch(toggleNavigatorTitle(true));
    dispatch(toggleNavigatorSearch(true));
    dispatch(toggleNavigatorCart(true));
  });
}
