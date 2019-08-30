import {
  userDidLogin$,
  userDataReceived$,
} from '@shopgate/engage/user';

/**
 * Gets triggered if login was successful and we received the user data.
 */
export const loginSuccess$ = userDidLogin$.switchMap(() => userDataReceived$.first());
