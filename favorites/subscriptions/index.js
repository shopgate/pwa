/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import {
  userDidLogin$,
  userDidLogout$,
} from '@shopgate/pwa-common/streams/user';
import {
  favoritesDidEnter$,
} from '../streams';
import getFavorites from '../actions/getFavorites';

/**
 * Favorites page subscriptions.
 * @param {function} subscribe Subscribe function.
 */
const favorites = (subscribe) => {
  if (!process.env.APP_CONFIG.hasFavorites) {
    return;
  }
  // On App start, did log in, did log out and favorites page enter we need to fetch.
  subscribe(
    appDidStart$.merge(favoritesDidEnter$),
    ({ dispatch }) => {
      dispatch(getFavorites());
    }
  );

  subscribe(userDidLogin$.merge(userDidLogout$), ({ dispatch }) => {
    dispatch(getFavorites(true));
  });
};

export default favorites;
