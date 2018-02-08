/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import unsetViewLoading from '@shopgate/pwa-common/actions/view/unsetViewLoading';
import {
  addFavorites,
} from '@shopgate/pwa-common-commerce/favorites/actions/toggleFavorites';
import {
  favoritesWillFetch$,
  favoritesDidFetch$,
  favoritesWillRemoveItem$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import {
  getHistoryPathname,
} from '@shopgate/pwa-common/selectors/history';
import createToast from '@shopgate/pwa-common/actions/toast/createToast';

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
    dispatch(createToast({
      action: 'common.undo',
      actionOnClick: addFavorites(action.productId, true),
      message: 'favorites.removed',
      delay: 6000,
    }));
  });
  subscribe(favoritesWillFetch$, ({ dispatch }) => {
    dispatch(setViewLoading(FAVORITES_PATH));
  });
  subscribe(favoritesDidFetch$, ({ dispatch }) => {
    dispatch(unsetViewLoading(FAVORITES_PATH, true));
  });
}

