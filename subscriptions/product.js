/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { variantDidChange$ } from '@shopgate/pwa-common-commerce/product/streams';
import { productIsReady$ } from '../streams/product';
import {
  getSelectedVariantFormatted,
  getCurrentBaseProductFormatted,
  getCurrentProductFormatted,
} from '../selectors/product';
import getPage from '../selectors/page';
import { track } from '../helpers/index';

/**
 * Product tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function product(subscribe) {
  /**
   * Gets triggered on product variant change/selection.
   */
  subscribe(variantDidChange$, ({ getState }) => {
    const state = getState();
    const variant = getSelectedVariantFormatted(state);
    const baseProduct = getCurrentBaseProductFormatted(state);

    track('variantSelected', { variant, baseProduct }, state);
  });

  /**
   * Gets triggered on product pageview.
   */
  subscribe(productIsReady$, ({ getState }) => {
    const state = getState();
    const page = getPage(state);
    const currentProduct = getCurrentProductFormatted(state);

    track(
      'viewContent',
      { page, product: currentProduct },
      state
    );
  });
}
