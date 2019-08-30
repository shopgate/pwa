import { loginDidFail$ } from '@shopgate/engage/user';
import { makeGetUser } from '../selectors/user';
import { loginSuccess$ } from '../streams/user';
import { track } from '../helpers/index';

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function user(subscribe) {
  subscribe(loginSuccess$, ({ getState }) => {
    const getUser = makeGetUser();
    const state = getState();
    track('loginSuccess', getUser(state), state);
  });

  /**
   * Gets triggered if login failed.
   */
  subscribe(loginDidFail$, ({ getState }) => (
    track('loginFailed', undefined, getState())));
}
