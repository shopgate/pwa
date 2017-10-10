/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import appConfig from '@shopgate/pwa-common/helpers/config';

/**
 * Checks if Shopify checkout is available.
 * @returns {boolean}
 */
export const hasShopifyCheckout = () => appConfig.webCheckoutShopify !== null;

/**
 * Returns the Shopify checkout configuration.
 * @returns {Object|null}
 */
export const getShopifyCheckout = () => appConfig.webCheckoutShopify;

/**
 * Returns the aliased Shopify URL.
 * @returns {string}
 */
export const getShopifyUrl = () => `https://${getShopifyCheckout().alias}.myshopify.com`;
