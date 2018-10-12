import {
  errorManager,
  EINVALIDCREDENTIALS,
  SHOPGATE_USER_LOGIN_USER,
} from '@shopgate/pwa-core';
import { appWillStart$ } from '@shopgate/pwa-common/streams';

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
}
