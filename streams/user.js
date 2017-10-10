/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_LOGIN,
  SUCCESS_LOGIN,
  ERROR_LOGIN,
  REQUEST_LOGOUT,
  SUCCESS_LOGOUT,
  RECEIVE_USER,
  ERROR_USER,
} from '../constants/ActionTypes';
import { main$ } from './main';

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
  .filter(({ action }) =>
    action.type === SUCCESS_LOGIN ||
    action.type === ERROR_LOGIN
  );

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
  .filter(({ action }) =>
    (action.type === RECEIVE_USER) ||
    (action.type === SUCCESS_LOGOUT) ||
    (action.type === ERROR_USER)
  );
