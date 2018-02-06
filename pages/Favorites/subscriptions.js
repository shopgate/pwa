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
  favoritesWillFetch$,
  favoritesDidFetch$,
} from '@shopgate/pwa-common-commerce/favorites/streams';

/**
 * Favorites page subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function favorites(subscribe) {
  subscribe(favoritesWillFetch$, ({ dispatch }) => {
    dispatch(setViewLoading(FAVORITES_PATH));
  });
  subscribe(favoritesDidFetch$, ({ dispatch }) => {
    dispatch(unsetViewLoading(FAVORITES_PATH, true));
  });
}

