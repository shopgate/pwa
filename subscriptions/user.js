/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '@shopgate/pwa-core/classes/Event';
import registerEvents from '@shopgate/pwa-core/commands/registerEvents';
import getUser from '../actions/user/getUser';
import { successLogin } from '../action-creators/user';
import { appDidStart$ } from '../streams/app';
import { userWillLogin$, userLoginResponse$, userDidLogin$ } from '../streams/user';
import setViewLoading from '../actions/view/setViewLoading';
import unsetViewLoading from '../actions/view/unsetViewLoading';
import { LOGIN_PATH } from '../constants/RoutePaths';

/**
 * User subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function user(subscribe) {
  /**
   * Gets triggered when ever the user data need to be updated.
   */
  const userNeedsUpdate$ = appDidStart$.merge(userDidLogin$);

  subscribe(userWillLogin$, ({ dispatch }) => {
    dispatch(setViewLoading(LOGIN_PATH));
  });

  subscribe(userLoginResponse$, ({ dispatch }) => {
    dispatch(unsetViewLoading(LOGIN_PATH));
  });

  subscribe(userNeedsUpdate$, ({ dispatch }) => {
    dispatch(getUser());
  });

  subscribe(appDidStart$, ({ dispatch }) => {
    registerEvents(['userLoggedIn']);

    event.addCallback('userLoggedIn', () => dispatch(successLogin()));
  });
}
