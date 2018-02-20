/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import {
  addFavorites,
} from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import {
  favoritesWillRemoveItem$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import {
  getHistoryPathname,
} from '@shopgate/pwa-common/selectors/history';
import createToast from '@shopgate/pwa-common/actions/toast/createToast';
import { FAVORITES_SHOW_TOAST_DELAY } from './constants';

/**
 * Favorites page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function favorites(subscribe) {
  subscribe(favoritesWillRemoveItem$, ({ dispatch, action, getState }) => {
    if (getHistoryPathname(getState()) !== FAVORITES_PATH) {
      // No toast message when favorites is not active page.
      return;
    }
    // Animations are too fast. This should wait a little bit.
    setTimeout(() => {
      dispatch(createToast({
        action: 'common.undo',
        actionOnClick: addFavorites(action.productId, true),
        message: 'favorites.removed',
        duration: 6000,
      }));
    }, FAVORITES_SHOW_TOAST_DELAY);
  });
}

