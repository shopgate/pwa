/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { historyDidUpdate$ } from '@shopgate/pwa-common/streams/history';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

/**
 * Gets triggered when the checkout link is opened.
 * @type {Observable}
 */
export const openedCheckoutLink$ = historyDidUpdate$
  .filter(({ action }) => (
    action.historyProps &&
    action.historyProps.pathname &&
    action.historyProps.pathname === CHECKOUT_PATH
  ));

