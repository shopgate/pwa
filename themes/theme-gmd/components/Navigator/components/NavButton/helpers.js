import { LOGIN_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';

// A whitelist of route patterns where the <- icon should be shown.
export const backWhitelist = [
  `${CATEGORY_PATH}/:categoryId/filter/:attribute`,
  `${SEARCH_PATH}/filter/:attribute`,
];

// A whitelist of route patterns where the X icon should be shown.
export const crossWhitelist = [
  LOGIN_PATH,
  `${ITEM_PATH}/:productId/write_review`,
  `${CATEGORY_PATH}/:categoryId/filter`,
  `${SEARCH_PATH}/filter`,
];

/**
 * @param {string} pattern The pattern to check against.
 * @returns {boolean}
 */
export const showBackButton = pattern => backWhitelist.includes(pattern);

/**
 * @param {string} pattern The pattern to check against.
 * @returns {boolean}
 */
export const showCloseButton = pattern => crossWhitelist.includes(pattern);
