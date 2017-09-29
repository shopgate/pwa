/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSelector } from 'reselect';
import {
  getHistoryPathname,
  getQueryParamsAsString,
} from '@shopgate/pwa-common/selectors/history';
import { isDev } from '@shopgate/pwa-common/helpers/environment';

/**
 * The tracking base URL.
 * @type {string}
 */
const baseUrl = `https://rapid.shopgate.com${isDev ? '/php/shopgate' : ''}/sg_app_resources`;

/**
 * The mapping of page names to tracking page names.
 * @type {Object}
 */
const pageNameMap = {
  '': 'startpage',
  product: 'productDetails',
  item: 'productDetails',
  category: 'productList',
};

/**
 * Selects the current tracking URL.
 * @param {Object} state The current state.
 * @returns {string} The URL.
 */
const getTrackingUrl = createSelector(
  () => 0, // TODO: Retrieve shop number somehow
  getHistoryPathname,
  getQueryParamsAsString,
  (shopNumber, pathname, queryString) => (
    `${baseUrl}/${shopNumber}${pathname}${queryString}`
  )
);

/**
 * Extracts the name of the current path.
 * @param {Object} state The current state.
 * @returns {string} The name.
 */
const getPageName = createSelector(
  getHistoryPathname,
  pathname => pathname.split('/')[1]
);

/**
 * Selects the general UI state.
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getGeneralUI = state => state.ui.general;

/**
 * Selects the current page title.
 * @param {Object} state The current state.
 * @returns {string} The current page title.
 */
export const getPageTitle = createSelector(
  getGeneralUI,
  general => general.title || ''
);

/**
 * Selects the tracking page name based on the current page name.
 * @param {Object} state The current state.
 * @returns {string} The page name.
 */
const getPageTrackingName = createSelector(
  getPageName,
  pageName => pageNameMap[pageName] || pageName
);

/**
 * Selects the page information.
 * @param {Object} state The current state.
 * @returns {Object} The page information.
 */
export default createSelector(
  getTrackingUrl,
  getPageTrackingName,
  (link, title, name) => ({
    link,
    title,
    name,
  })
);
