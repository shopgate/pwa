import {
  userDidLogin$,
  userDataReceived$,
  loginDidFail$,
} from '@shopgate/pwa-common/streams/user';
import { track } from '../helpers/index';

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function user(subscribe) {
  /**
   * Gets triggered if login was successful and we received the user data.
   */
  const loginSuccess$ = userDataReceived$
    .zip(userDidLogin$)
    .map(([first]) => first);

  subscribe(loginSuccess$, ({ action, getState }) => (
    track('loginSuccess', action.user, getState())));

  /**
   * Gets triggered if login failed.
   */
  subscribe(loginDidFail$, ({ getState }) => (
    track('loginFailed', undefined, getState())));
}
