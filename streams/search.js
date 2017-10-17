/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'rxjs/add/operator/switchMap';
import {
  SEARCH_PATH,
  RECEIVE_SEARCH_RESULTS,
} from '@shopgate/pwa-common-commerce/search/constants';
import { routeDidNotChange } from '@shopgate/pwa-common/streams/history';
import { main$ } from '@shopgate/pwa-common/streams/main';

/**
 * Emits when the search route is active.
 */
const searchIsActive$ = routeDidNotChange(SEARCH_PATH);

/**
 * Emits when search results are received.
 */
const resultsReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_SEARCH_RESULTS);

/**
 * Emits when the search is ready to be tracked and all relevant data is available.
 */
export const searchIsReady$ = searchIsActive$.switchMap(() => resultsReceived$.first());
