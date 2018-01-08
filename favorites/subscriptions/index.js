/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  routeDidEnter,
} from '@shopgate/pwa-common/streams/history';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import {
  FAVORITES_PATH,
} from '../constants';
import getFavorites from '../actions/getFavorites';

/**
 * Dispatches fetch action.
 * Callback for all subscriptions which should end up in
 * fetching favorites.
 * @param {function} dispatch Dispatch.
 */
const dispatchFetch = ({ dispatch }) => {
  dispatch(getFavorites());
};

/**
 * Favorites page subscriptions.
 * @param {function} subscribe Subscribe function.
 */
const favorites = (subscribe) => {
  // On App start.
  subscribe(appDidStart$, dispatchFetch);
  // On page enter.
  const favoritesDidEnter$ = routeDidEnter(FAVORITES_PATH);
  subscribe(favoritesDidEnter$, dispatchFetch);
};

export default favorites;
