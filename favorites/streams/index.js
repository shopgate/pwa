/*
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'rxjs/add/operator/distinctUntilChanged';
import {
  routeDidEnter,
} from '@shopgate/pwa-common/streams/history';

import {
  main$,
} from '@shopgate/pwa-common/streams/main';

import {
  FAVORITES_PATH,
  ERROR_FETCH_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
} from '../constants';

export const favoritesDidEnter$ = routeDidEnter(FAVORITES_PATH);

export const favoritesChanged$ = main$.filter(({ action }) => [
  RECEIVE_REMOVE_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  ERROR_FETCH_FAVORITES,
].includes(action.type));
