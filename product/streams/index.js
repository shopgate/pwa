/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/combineLatest';
import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  RECEIVE_PRODUCT,
  SET_PRODUCT_VARIANT_ID,
} from '../constants';

/**
 * Gets triggered when product data received.
 * @type {Observable}
 */
export const productReceived$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT)
  .distinctUntilChanged();

/**
 * Gets triggered when VariantId changes and product data received for this variant.
 * @type {Observable}
 */
export const variantDidChange$ = main$
  .filter(({ action }) => (
    action.type === SET_PRODUCT_VARIANT_ID && action.productVariantId !== null
  ))
  .distinctUntilChanged()
  .combineLatest(productReceived$)
  .filter(data => data[0].action.productVariantId === data[1].action.productId)
  .map(data => data[1]);
