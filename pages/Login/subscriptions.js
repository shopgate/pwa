/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import { toggleLogin } from 'Components/Navigator/action-creators';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';
import enableNavigatorSearch from 'Components/Navigator/actions/enableNavigatorSearch';
import disableNavigatorTitle from 'Components/Navigator/actions/disableNavigatorTitle';
import enableNavigatorTitle from 'Components/Navigator/actions/enableNavigatorTitle';
import toggleCartIcon from 'Components/Navigator/actions/toggleCartIcon';

/**
 * Login subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function login(subscribe) {
  const loginRouteDidEnter$ = routeDidEnter(LOGIN_PATH);
  const loginRouteDidLeave$ = routeDidLeave(LOGIN_PATH);

  /**
   * Gets triggered on entering the filter route.
   */
  subscribe(loginRouteDidEnter$, ({ dispatch }) => {
    dispatch(toggleLogin(true));
    dispatch(disableNavigatorTitle());
    dispatch(disableNavigatorSearch());
    dispatch(toggleCartIcon(false));
  });

  /**
   * Gets triggered on leaving the filter route.
   */
  subscribe(loginRouteDidLeave$, ({ dispatch }) => {
    dispatch(toggleLogin(false));
    dispatch(enableNavigatorTitle());
    dispatch(enableNavigatorSearch());
    dispatch(toggleCartIcon(true));
  });
}
