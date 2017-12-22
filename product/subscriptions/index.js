/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';

import {
  ITEM_PATH,
} from '../constants';

import setProductId from '../action-creators/setProductId';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function product(subscribe) {
  const itemRouteDidEnter$ = routeDidEnter(ITEM_PATH);
  const itemRouteDidLeave$ = routeDidLeave(ITEM_PATH).filter(({ pathname }) => (
    !pathname.startsWith(ITEM_PATH)
  ));

  subscribe(itemRouteDidEnter$, ({ dispatch, pathname }) => {
    const productId = hex2bin(pathname.split('/')[2]);
    dispatch(setProductId(productId));
  });

  subscribe(itemRouteDidLeave$, ({ dispatch }) => {
    dispatch(setProductId(null));
  });
}

export default product;
