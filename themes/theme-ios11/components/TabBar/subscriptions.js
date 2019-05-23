import { LOGIN_PATH, CHECKOUT_PATH } from '@shopgate/engage/checkout';
import { CART_PATH } from '@shopgate/engage/cart';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/engage/product';
import { CATEGORY_FILTER_PATTERN } from '@shopgate/engage/category';
import { SEARCH_FILTER_PATTERN } from '@shopgate/engage/search';
import { SCANNER_PATH } from '@shopgate/engage/scanner';
import { getCartItems } from '@shopgate/engage/cart';
import { routeDidEnter$ } from '@shopgate/engage/core';
import { cartUpdatedWhileVisible$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { getCurrentRoute } from '@shopgate/engage/core';
import { appWillStart$ } from '@shopgate/engage/core';
import { configuration } from '@shopgate/pwa-common/collections';
import { TAB_BAR_PATTERNS_BLACK_LIST } from '@shopgate/pwa-common/constants/Configuration';
import {
  enableTabBar,
  disableTabBar,
} from './actions';

const blacklist = [
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
  CATEGORY_FILTER_PATTERN,
  SEARCH_FILTER_PATTERN,
  LOGIN_PATH,
  CHECKOUT_PATH,
  SCANNER_PATH,
];

/**
 * Whether the TabBar should be visible for the cart page.
 * @param {Object} state The application state
 * @returns {bool}
 */
const shouldCartHaveTabBar = state => getCartItems(state).length === 0;

/**
 * TabBar subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function tabBar(subscribe) {
  subscribe(appWillStart$, () => {
    // Set a blacklist where tab bar is hidden
    configuration.set(TAB_BAR_PATTERNS_BLACK_LIST, blacklist);
  });

  // When a route enters we update the tabbar visibility.
  subscribe(routeDidEnter$, ({ dispatch, getState }) => {
    const { pattern } = getCurrentRoute(getState());
    let enable = false;

    if (pattern === CART_PATH) {
      // Enable tabbar for empty cart page.
      enable = shouldCartHaveTabBar(getState());
    } else if (!configuration.get(TAB_BAR_PATTERNS_BLACK_LIST).includes(pattern)) {
      // Enable tabbar for those that are not blacklisted.
      enable = true;
    }

    dispatch(enable ? enableTabBar() : disableTabBar());
  });

  // When the cart update we need reevaluate the decision.
  subscribe(cartUpdatedWhileVisible$, ({ getState, dispatch }) => {
    dispatch(shouldCartHaveTabBar(getState())
      ? enableTabBar()
      : disableTabBar());
  });
}
