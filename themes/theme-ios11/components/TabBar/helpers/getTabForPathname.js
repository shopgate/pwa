import { INDEX_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { FAVORITES_PATH } from '@shopgate/pwa-common-commerce/favorites/constants';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';
import { BROWSE_PATH } from 'Pages/Browse/constants';
import { MORE_PATH } from 'Pages/More/constants';
import {
  TAB_HOME,
  TAB_BROWSE,
  TAB_CART,
  TAB_FAVORITES,
  TAB_MORE,
  TAB_NONE,
} from '../constants';

export const TAB_ROOTS = {
  [TAB_HOME]: INDEX_PATH,
  [TAB_BROWSE]: BROWSE_PATH,
  [TAB_CART]: CART_PATH,
  [TAB_FAVORITES]: FAVORITES_PATH,
  [TAB_MORE]: MORE_PATH,
};

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
