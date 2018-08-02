import { LOGIN_PATH, CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { FILTER_PATH } from '@shopgate/pwa-common-commerce/filter/constants';
import { routeDidChange$ } from '@shopgate/pwa-common/streams/history';
import {
  enableTabBar,
  disableTabBar,
} from './actions';

/**
 * App subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function tabBar(subscribe) {
  const pathsWithoutTabBar = [
    CART_PATH,
    ITEM_PATH,
    FILTER_PATH,
    LOGIN_PATH,
    CHECKOUT_PATH,
  ];

  /**
   * Gets triggered when the route changed.
   */
  subscribe(routeDidChange$, ({ dispatch, pathname }) => {
    // Check if the tabbar is enabled for the current active route.
    const enabled = !pathsWithoutTabBar.find(entry => pathname.startsWith(entry));

    if (enabled) {
      dispatch(enableTabBar());
    } else {
      dispatch(disableTabBar());
    }
  });
}
