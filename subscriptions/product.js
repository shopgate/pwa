/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import { variantDidChange$, productReceived$ } from '@shopgate/pwa-common-commerce/product/streams';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import {
  getSelectedVariantFormatted,
  getCurrentBaseProductFormatted,
  getCurrentProductFormatted,
} from '../selectors/product';
import getPage from '../selectors/page';
/**
 * Product tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  /**
   * Gets triggered on product variant change/selection
   */
  subscribe(variantDidChange$, ({ getState }) => {
    const state = getState();
    const variant = getSelectedVariantFormatted(state);
    const baseProduct = getCurrentBaseProductFormatted(state);

    core.track.variantSelected({ variant, baseProduct });
  });

  /**
   * Emits when the product route was entered.
   */
  const productDidEnter$ = routeDidEnter(ITEM_PATH);

  /**
   * Gets triggered on product pageview
   */
  subscribe(productDidEnter$, ({ getState }) => {
    const state = getState();

    const page = getPage(state);
    let currentProduct = getCurrentProductFormatted(state);

    if (currentProduct) {
      // Product data are already there
      core.track.viewContent({
        page,
        ...currentProduct,
      });
    } else {
      // Product data not there yet
      const subscription = subscribe(productReceived$, ({ getState: getReceivedState }) => {
        subscription.unsubscribe();

        currentProduct = getCurrentProductFormatted(getReceivedState());

        core.track.viewContent({
          page,
          ...currentProduct,
        });
      });
    }
  });
}
