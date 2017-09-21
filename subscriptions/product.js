/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import core from '@shopgate/tracking-core/core/Core';
import { variantDidChange$ } from '@shopgate/pwa-common-commerce/product/streams';
import {
  getSelectedVariantFormatted,
  getCurrentBaseProductFormatted,
} from '../selectors/product';

/**
 * Pages tracking subscriptions.
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
}
