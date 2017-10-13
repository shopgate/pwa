/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import {
  CATEGORY_PATH,
  RECEIVE_ROOT_CATEGORIES,
} from '../constants';
import { FILTER_PATH } from '../../filter/constants';

/**
 * Gets triggered when leaving a category route.
 * When opening the filter page the categoryId should be preserved
 * so that the filters know what category needs to be filtered.
 */
export const categoryRouteDidLeave$ = routeDidLeave(CATEGORY_PATH).filter(
  // A transition to filters should not count as 'leaving'.
  ({ pathname }) => !pathname.startsWith(FILTER_PATH)
);

/**
 * Gets triggered when entering a category route.
 */
export const categoryRouteDidEnter$ = routeDidEnter(CATEGORY_PATH);

/**
 * Gets triggered when the root categories received.
 */
export const receivedRootCategories$ = main$.filter(
  ({ action }) => action.type === RECEIVE_ROOT_CATEGORIES
);
