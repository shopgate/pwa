import {
  errorManager,
  EINVALIDCREDENTIALS,
} from '@shopgate/engage/core';
import { SHOPGATE_USER_LOGIN_USER } from '@shopgate/engage/core';
import { appWillStart$ } from '@shopgate/engage/core';

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
