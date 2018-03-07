/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import appConfig from '@shopgate/pwa-common/helpers/config';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import {
  userDidLogin$,
  userDidLogout$,
} from '@shopgate/pwa-common/streams/user';
import {
  favoritesDidEnter$,
  favoritesSyncIdle$,
  favoritesError$,
} from '../streams';
import getFavorites from '../actions/getFavorites';
import { FETCH_FAVORITES_THROTTLE } from '../constants';
/**
 * Favorites page subscriptions.
 * @param {function} subscribe Subscribe function.
 */
const favorites = (subscribe) => {
  if (!appConfig.hasFavorites) {
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

  /*
   * Request after 5 seconds since last sync request to make sure
   * backend did actually save it.
   */
  let fetchThrottle;
  subscribe(favoritesSyncIdle$, ({ dispatch }) => {
    clearTimeout(fetchThrottle);
    fetchThrottle = setTimeout(() => dispatch(getFavorites(true)), FETCH_FAVORITES_THROTTLE);
  });

  subscribe(favoritesError$, ({ dispatch }) => {
    // No clearTimeout. This is special case. Should fetch ASAP.
    dispatch(getFavorites(true));
  });
};

export default favorites;
