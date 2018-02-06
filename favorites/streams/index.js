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
  RECEIVE_ADD_FAVORITES,
  RECEIVE_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  REQUEST_FAVORITES,
} from '../constants';

export const favoritesDidEnter$ = routeDidEnter(FAVORITES_PATH);

export const favoritesWillFetch$ = main$.filter(({ action }) => [
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  REQUEST_FAVORITES,
].includes(action.type));

export const favoritesDidFetch$ = main$.filter(({ action }) => action.type === RECEIVE_FAVORITES);

export const favoritesChanged$ = main$.filter(({ action }) => [
  RECEIVE_REMOVE_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
].includes(action.type));
