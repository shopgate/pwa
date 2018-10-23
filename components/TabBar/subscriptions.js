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
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';
import {
  enableTabBar,
  disableTabBar,
} from './actions';

const blacklist = [
  CART_PATH,
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
 * TabBar subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function tabBar(subscribe) {
  subscribe(routeDidEnter$, ({ dispatch }) => {
    const { pattern } = getCurrentRoute();

    if (blacklist.includes(pattern)) {
      dispatch(disableTabBar());
    } else {
      dispatch(enableTabBar());
    }
  });
}
