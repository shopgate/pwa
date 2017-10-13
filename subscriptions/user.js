/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import {
  userDidLogin$,
  userDataReceived$,
  loginDidFail$,
} from '@shopgate/pwa-common/streams/user';

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

  subscribe(loginSuccess$, ({ action }) => core.track.loginSuccess(action.user));

  /**
   * Gets triggered if login failed.
   */
  subscribe(loginDidFail$, () => core.track.loginFailed());
}
