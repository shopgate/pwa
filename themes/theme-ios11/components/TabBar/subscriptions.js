import { LOGIN_PATH, CHECKOUT_PATH, REGISTER_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  ITEM_GALLERY_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { checkoutRoutes } from '@shopgate/engage/checkout';
import { CATEGORY_FILTER_PATTERN, CATEGORY_ALL_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import { SCANNER_PATH } from '@shopgate/pwa-common-commerce/scanner/constants';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { appWillStart$ } from '@shopgate/pwa-common/streams';
import { configuration } from '@shopgate/pwa-common/collections';
import { TAB_BAR_PATTERNS_BLACK_LIST } from '@shopgate/pwa-common/constants/Configuration';
import { FORGOT_PASSWORD_PATTERN } from '@shopgate/engage/login';
import { PAGE_PREVIEW_PATTERN } from '@shopgate/engage/page/constants';
import {
  enableTabBar,
  disableTabBar,
  setTabLastRoute,
} from './actions';
import isTabBarVisible from './helpers/isTabBarVisible';
import getTabForPathname from './helpers/getTabForPathname';
import { TAB_NONE } from './constants';

const blacklist = [
  ITEM_GALLERY_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
  CATEGORY_FILTER_PATTERN,
  CATEGORY_ALL_FILTER_PATTERN,
  SEARCH_FILTER_PATTERN,
  LOGIN_PATH,
  CHECKOUT_PATH,
  SCANNER_PATH,
  REGISTER_PATH,
  FORGOT_PASSWORD_PATTERN,
  PAGE_PREVIEW_PATTERN,
  ...checkoutRoutes,
];

/**
 * TabBar subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function tabBar(subscribe) {
  subscribe(appWillStart$, () => {
    // Set a blacklist where tab bar is hidden
    configuration.set(TAB_BAR_PATTERNS_BLACK_LIST, blacklist);
  });

  subscribe(routeDidEnter$, ({ dispatch, getState }) => {
    const { pathname, pattern, state } = getCurrentRoute(getState()) || {};

    if (!pattern) {
      return;
    }

    const visible = isTabBarVisible(pattern);
    const tab = getTabForPathname(pathname);

    dispatch(visible ? enableTabBar() : disableTabBar());

    if (visible && tab !== TAB_NONE) {
      dispatch(setTabLastRoute(tab, {
        pathname,
        pattern,
        state,
      }));
    }
  });
}
