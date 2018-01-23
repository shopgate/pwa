/*
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
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
  FAVORITES_PATH,
} from '../constants';

export const favoritesDidEnter$ = routeDidEnter(FAVORITES_PATH);
