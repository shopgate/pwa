import { createSelector } from 'reselect';
import { shopNumber } from '@shopgate/pwa-common/helpers/config';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';

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
  getCurrentPathname,
  pathname => `${baseUrl}/${shopNumber}${pathname}`
);

/**
 * Extracts the name of the current path.
 * @param {Object} state The current state.
 * @returns {string} The name.
 */
const getPageName = createSelector(
  getCurrentPathname,
  pathname => pathname.split('?')[0].split('/')[1]
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
  (link, name) => ({
    link,
    name,
  })
);
