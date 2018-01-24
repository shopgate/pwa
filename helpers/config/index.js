/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * The app.json config from the theme.
 * @typedef {Object}
 */
const appConfig = process.env.APP_CONFIG;

/**
 * The components.json config from the theme.
 * @typedef {Object}
 */
export const componentsConfig = process.env.COMPONENTS_CONFIG;

export const shopNumber = appConfig.appId.replace('shop_', '');

export default appConfig;
