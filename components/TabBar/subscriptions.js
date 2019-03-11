import { LOGIN_PATH, CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import {
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
} from '@shopgate/pwa-common-commerce/product/constants';
import { CATEGORY_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/category/constants';
import { SEARCH_FILTER_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import { getCartItems } from '@shopgate/pwa-common-commerce/cart/selectors';
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

const blacklist = [
  ITEM_PATTERN,
  ITEM_GALLERY_PATTERN,
  ITEM_REVIEWS_PATTERN,
  ITEM_WRITE_REVIEW_PATTERN,
  CATEGORY_FILTER_PATTERN,
  SEARCH_FILTER_PATTERN,
  LOGIN_PATH,
  CHECKOUT_PATH,
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
