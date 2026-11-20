import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { TAB_BROWSE, TAB_NONE } from '../constants';
import { CORE_TAB_DATA, CORE_TAB_TYPES } from '../coreTabData';

export const TAB_ROOTS = Object.fromEntries(
  CORE_TAB_TYPES.map(type => [type, CORE_TAB_DATA[type].path])
);

const BROWSE_PREFIXES = [SEARCH_PATH, CATEGORY_PATH, `${ITEM_PATH}/`];

/**
 * Returns the tab a pathname belongs to, returns TAB_NONE if it belongs to none.
 * @param {string} pathname The pathname.
 * @returns {string}
 */
const getTabForPathname = (pathname) => {
  if (!pathname) {
    return TAB_NONE;
  }

  const root = Object.keys(TAB_ROOTS).find(tab => TAB_ROOTS[tab] === pathname);

  if (root) {
    return root;
  }

  return BROWSE_PREFIXES.some(prefix => pathname.startsWith(prefix)) ? TAB_BROWSE : TAB_NONE;
};

export default getTabForPathname;
