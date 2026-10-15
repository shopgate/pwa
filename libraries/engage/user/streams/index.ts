import {
  userWillLogin$ as userWillLoginStream,
  userLoginResponse$ as userLoginResponseStream,
  userDidLogin$ as userDidLoginStream,
  userWillLogout$ as userWillLogoutStream,
  userDidLogout$ as userDidLogoutStream,
  loginDidFail$ as loginDidFailStream,
} from '@shopgate/pwa-common/streams/user';
import type { ActionStream, StreamAction } from '../../core/types';
import type {
  ErrorLoginAction,
  RequestLoginAction,
  SuccessLoginAction,
  SuccessLogoutAction,
} from '../types';

export {
  userDidUpdate$,
  userDidInitialize$,
  userDataReceived$,
  legacyConnectRegisterDidFail$,
  sessionExpiryNeedsToBeChecked$,
  userSessionExpired$,
} from '@shopgate/pwa-common/streams/user';
export { registrationSuccess$ } from '@shopgate/engage/registration/streams';

/**
 * Emits when a login is requested.
 */
export const userWillLogin$ = userWillLoginStream as ActionStream<RequestLoginAction>;

/**
 * Emits when a login request got its response, successful or not.
 */
export const userLoginResponse$ = userLoginResponseStream as ActionStream<
  SuccessLoginAction | ErrorLoginAction
>;

/**
 * Emits when the user logged in.
 */
export const userDidLogin$ = userDidLoginStream as ActionStream<SuccessLoginAction>;

/**
 * Emits when a logout is requested.
 */
export const userWillLogout$ = userWillLogoutStream as ActionStream<StreamAction>;

/**
 * Emits when the user logged out.
 */
export const userDidLogout$ = userDidLogoutStream as ActionStream<SuccessLogoutAction>;

/**
 * Emits when a login failed.
 */
export const loginDidFail$ = loginDidFailStream as ActionStream<ErrorLoginAction>;
