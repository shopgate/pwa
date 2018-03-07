/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CATEGORY_PATH } from '../constants';
import setCurrentCategoryId from '../action-creators/setCurrentCategoryId';
import {
  categoryRouteDidEnter$,
  categoryRouteDidLeave$,
} from '../streams';

/**
 * Category subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function category(subscribe) {
  /**
   * Attention: The order of the subscriptions of categoryRouteDidLeave$ and categoryRouteDidEnter$
   * is relevant to guarantee, that the events are called within the right order.
   */

  /**
   * Gets triggered when leaving a category route.
   * When opening the filter page the categoryId should be preserved
   * so that the filters know what category needs to be filtered.
   */
  subscribe(categoryRouteDidLeave$, ({ dispatch, pathname }) => {
    if (!pathname.startsWith(CATEGORY_PATH)) {
      dispatch(setCurrentCategoryId(''));
    }
  });

  /**
   * Gets triggered when entering a category route.
   */
  subscribe(categoryRouteDidEnter$, ({ dispatch, pathname }) => {
    dispatch(setCurrentCategoryId(pathname));
  });
}
