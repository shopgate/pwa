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
import setProductVariantId from '../action-creators/setProductVariantId';
import { getCurrentProductVariantId } from '../selectors/variants';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function product(subscribe) {
  const itemRouteDidEnter$ = routeDidEnter(ITEM_PATH);
  const itemRouteDidLeave$ = routeDidLeave(ITEM_PATH).filter(({ pathname }) => (
    !pathname.startsWith(ITEM_PATH)
  ));

  subscribe(itemRouteDidEnter$, ({ dispatch, getState }) => {
    const state = getState();
    const baseProductId = hex2bin(state.history.pathname.split('/')[2]);
    const selectedVariantId = getCurrentProductVariantId(state);

    if (selectedVariantId) {
      dispatch(setProductVariantId(selectedVariantId));
      return;
    }

    dispatch(setProductId(baseProductId));
  });

  subscribe(itemRouteDidLeave$, ({ dispatch, getState }) => {
    const state = getState();
    /*
     If there is a redirect to login we don't want the state to be mutated,
     only if we leave product route by navigation.
     */
    if (!state.history.redirectLocation) {
      dispatch(setProductId(null));
      dispatch(setProductVariantId(null));
    }
  });
}

export default product;
