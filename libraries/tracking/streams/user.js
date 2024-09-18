import {
  userDidLogin$,
  userDataReceived$,
  registrationSuccess$ as registrationSuccessCore$,
  REGISTRATION_FORM_LOGIN_STRATEGY,
} from '@shopgate/engage/user';

/**
 * Gets triggered if login was successful and we received the user data.
 */
export const loginSuccess$ = userDidLogin$
  // Do not track a login when user was automatically logged in after registration
  .filter(({ action }) => action?.strategy !== REGISTRATION_FORM_LOGIN_STRATEGY)
  .switchMap(() => userDataReceived$.first());

/**
 * Gets triggered if registration was successful and we received the user data.
 */
export const registrationSuccess$ = registrationSuccessCore$
  .switchMap(() => userDataReceived$.first());
