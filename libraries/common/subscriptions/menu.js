/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { appDidStart$ } from '../streams/app';
import fetchMenu from '../actions/menu/fetchMenu';
import { QUICKLINKS_MENU } from '../constants/MenuIDs';

/**
 * Menu subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function menu(subscribe) {
  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch }) => {
    dispatch(fetchMenu(QUICKLINKS_MENU));
  });
}
