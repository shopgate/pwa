import {
  errorManager,
  EINVALIDCREDENTIALS,
} from '@shopgate/pwa-core';
import { SHOPGATE_USER_LOGIN_USER } from '@shopgate/pwa-common/constants/Pipelines';
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
