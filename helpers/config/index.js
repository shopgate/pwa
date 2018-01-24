/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Provides a default theme config as a fallback.
 * @type {Object}
 */
const defaultThemeConfig = {
  font: {},
  colors: {},
  variables: {},
};

/**
 * The app.json config from the theme.
 * @typedef {Object}
 */
const appConfig = process.env.APP_CONFIG || {};

/**
 * The components.json config from the theme.
 * @typedef {Object}
 */
export const componentsConfig = process.env.COMPONENTS_CONFIG || {};

/**
 * The theme configuration.
 * @typedef {Object}
 */
export const themeConfig = process.env.THEME_CONFIG || defaultThemeConfig;

const { appId } = appConfig;
export const shopNumber = appId ? appId.replace('shop_', '') : '';

export default appConfig;
