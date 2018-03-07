/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  SUCCESS_SHOPIFY_LOGIN,
  ERROR_SHOPIFY_LOGIN,
} from '../constants';

/**
 * Gets triggered on successful Shopify login.
 * @type {Observable}
 */
export const shopifyDidLogin$ = main$
  .filter(({ action }) => action.type === SUCCESS_SHOPIFY_LOGIN);

/**
 * Gets triggered on failed Shopify login.
 * @type {Observable}
 */
export const shopifyLoginFailed$ = main$
  .filter(({ action }) => action.type === ERROR_SHOPIFY_LOGIN);

/**
 * Gets triggered on any Shopify login response (success or error).
 * @type {Observable}
 */
export const shopifyDidRespond$ = (
  shopifyDidLogin$.merge(shopifyLoginFailed$)
);
