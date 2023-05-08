import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';

import {
  REQUEST_LOGIN,
  SUCCESS_LOGIN,
  ERROR_LOGIN,
  ERROR_LEGACY_CONNECT_REGISTER,
  REQUEST_LOGOUT,
  SUCCESS_LOGOUT,
  RECEIVE_USER,
  ERROR_USER,
} from '../constants/ActionTypes';
import { appDidStart$ } from './app';
import { main$ } from './main';
import { SESSION_EXPIRY_CHECK_INTERVAL } from '../constants/user';
import { getSessionExpiry } from '../selectors/user';

/**
 * Gets triggered when user is requesting to login.
 * @type {Observable}
 */
export const userWillLogin$ = main$
  .filter(({ action }) => action.type === REQUEST_LOGIN);

/**
 * Gets triggered when user login request has gained a response.
 * @type {Observable}
 */
export const userLoginResponse$ = main$
  .filter(({ action }) => (
    action.type === SUCCESS_LOGIN ||
    action.type === ERROR_LOGIN
  ));

/**
 * Gets triggered when user has logged in.
 * @type {Observable}
 */
export const userDidLogin$ = main$
  .filter(({ action }) => action.type === SUCCESS_LOGIN);

/**
 * Gets triggered when user is requesting to logout.
 * @type {Observable}
 */
export const userWillLogout$ = main$
  .filter(({ action }) => action.type === REQUEST_LOGOUT);

/**
 * Gets triggered when user has logged out.
 * @type {Observable}
 */
export const userDidLogout$ = main$
  .filter(({ action }) => action.type === SUCCESS_LOGOUT);

/**
 * Gets triggered when the user data was updated.
 * @type {Observable}
 */
export const userDidUpdate$ = main$
  .filter(({ action }) => (
    (action.type === RECEIVE_USER) ||
    (action.type === SUCCESS_LOGOUT) ||
    (action.type === ERROR_USER)
  ));

/**
 * Gets triggered when we have a stable login state of the user. Since user data is persisted,
 * some parts of the code might not rely on the redux states.
 * @type {Observable}
 */
export const userDidInitialize$ = appDidStart$.switchMap(() =>
  main$.filter(({ action }) => action.type === RECEIVE_USER || action.type === ERROR_USER)).first();

/**
 * Gets triggered when we received the user data.
 * @type {Observable}
 */
export const userDataReceived$ = userDidUpdate$
  .filter(({ action }) => action.type === RECEIVE_USER);

/**
 * Gets triggered when the login failed.
 * @type {Observable}
 */
export const loginDidFail$ = main$
  .filter(({ action }) => action.type === ERROR_LOGIN);

/**
 * Gets triggered when the legacy sgconnect registration failed
 * @type {Observable}
 */
export const legacyConnectRegisterDidFail$ = main$
  .filter(({ action }) => action.type === ERROR_LEGACY_CONNECT_REGISTER);

/**
 * Emits when user session expiry needs to be checked. That's the case when the login state in
 * Redux contains a numeric value for the "expires" property.
 * Checks are performed at appStart since there might be a persisted value in Redux from the last
 * sessions, or it happens after login when the login response contained a session lease.
 */
export const sessionExpiryNeedsToBeChecked$ = appDidStart$
  .merge(userDidLogin$)
  .filter(({ getState }) => {
    const expiry = getSessionExpiry(getState());
    return expiry !== null;
  });

/**
 * Emits when a user session with an expiry expires. Therefore it performs an interval check to
 * check if the session is still active.
 */
export const userSessionExpired$ = sessionExpiryNeedsToBeChecked$
  .switchMap(data => Observable.interval(SESSION_EXPIRY_CHECK_INTERVAL)
    .takeUntil(userDidLogout$)
    .filter(() => {
      const expiry = getSessionExpiry(data.getState());

      return typeof expiry === 'number' &&
        new Date().getTime() >= expiry - SESSION_EXPIRY_CHECK_INTERVAL;
    })
    .switchMap(() => Observable.of(data)));
