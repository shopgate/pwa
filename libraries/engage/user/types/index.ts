import type { StreamAction } from '../../core/types';

/**
 * A login request (`REQUEST_LOGIN`), e.g. from the login form.
 */
export interface RequestLoginAction extends StreamAction {
  /**
   * The username, as it was entered. Logins via other strategies may come without it.
   */
  user?: string;
  /**
   * The password, as it was entered. Logins via other strategies may come without it.
   */
  password?: string;
  /**
   * The login strategy, `basic` for the login form.
   */
  strategy: string;
}

/**
 * A successful login (`SUCCESS_LOGIN`).
 */
export interface SuccessLoginAction extends StreamAction {
  /**
   * Where to go after the login, e.g. `{ location }`, or `false` to stay on the current page.
   */
  redirect?: Record<string, unknown> | boolean;
  /**
   * The login strategy, `basic` for the login form.
   */
  strategy: string;
  /**
   * How long the session lasts, when the backend limits it.
   */
  sessionLifetimeInSeconds?: number;
  /**
   * Where the login came from, e.g. `LOGIN_SOURCE_BIOMETRIC`. Not set for a login via the form.
   */
  source?: string;
}

/**
 * A failed login (`ERROR_LOGIN`).
 */
export interface ErrorLoginAction extends StreamAction {
  /**
   * The messages of the login pipeline.
   */
  messages: unknown[];
  /**
   * The error code, e.g. `EINVALIDCREDENTIALS`. Empty when there is none.
   */
  code: string;
}

/**
 * A successful logout (`SUCCESS_LOGOUT`).
 */
export interface SuccessLogoutAction extends StreamAction {
  /**
   * Whether the user is told about the logout.
   */
  notify: boolean;
  /**
   * Whether the logout happened because the session expired.
   */
  autoLogout: boolean;
}
