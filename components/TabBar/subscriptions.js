import { LOGIN_PATH, CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import {
  CHECKOUT_CONFIRMATION_PATTERN,
  GUEST_CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PAYMENT_PATTERN,
} from '@shopgate/engage/checkout';
import { CATEGORY_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import { SCANNER_PATH } from '@shopgate/pwa-common-commerce/scanner/constants';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { cartUpdatedWhileVisible$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { appWillStart$ } from '@shopgate/pwa-common/streams';
import { configuration } from '@shopgate/pwa-common/collections';
import { TAB_BAR_PATTERNS_BLACK_LIST } from '@shopgate/pwa-common/constants/Configuration';
import {
  enableTabBar,
  disableTabBar,
} from './actions';
import shouldCartHaveTabBar from './helpers/shouldCartHaveTabBar';
import isTabBarVisible from './helpers/isTabBarVisible';

const blacklist = [
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
  CATEGORY_FILTER_PATTERN,
  SEARCH_FILTER_PATTERN,
  LOGIN_PATH,
  CHECKOUT_PATH,
  GUEST_CHECKOUT_PATTERN,
  GUEST_CHECKOUT_PAYMENT_PATTERN,
  SCANNER_PATH,
  CHECKOUT_CONFIRMATION_PATTERN,
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

  // When a route enters we update the tab bar visibility.
  subscribe(routeDidEnter$, ({ dispatch, getState }) => {
    const { pattern } = getCurrentRoute(getState());
    dispatch(isTabBarVisible(getState(), pattern) ? enableTabBar() : disableTabBar());
  });

  // When the cart update we need reevaluate the decision.
  subscribe(cartUpdatedWhileVisible$, ({ getState, dispatch }) => {
    dispatch(shouldCartHaveTabBar(getState())
      ? enableTabBar()
      : disableTabBar());
  });
}
