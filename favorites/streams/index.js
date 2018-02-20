/*
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'rxjs/add/operator/distinctUntilChanged';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  FAVORITES_PATH,
  REQUEST_REMOVE_FAVORITES,
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
  IDLE_SYNC_FAVORITES,
} from '../constants';

export const favoritesDidEnter$ = routeDidEnter(FAVORITES_PATH);

export const favoritesError$ = main$.filter(({ action }) => [
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
].includes(action.type));

export const favoritesWillRemoveItem$ = main$
  .filter(({ action }) => action.type === REQUEST_REMOVE_FAVORITES);

export const favoritesSyncIdle$ = main$.filter(({ action }) => action.type === IDLE_SYNC_FAVORITES);
