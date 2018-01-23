/*
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'rxjs/add/operator/distinctUntilChanged';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  routeDidEnter,
} from '@shopgate/pwa-common/streams/history';
import {
  RECEIVE_FAVORITES,
  FAVORITES_PATH,
} from '../constants';

export const receivedFavorites$ = main$
  .filter(({ action }) => action.type === RECEIVE_FAVORITES);

export const favoritesDidEnter$ = routeDidEnter(FAVORITES_PATH);

/**
 * Temporary stream which will be removed when #withCharacteristics would be true in the pipelines.
 */
export const favoritesDidEnterWithProducts$ = favoritesDidEnter$
  .zip(receivedFavorites$);
