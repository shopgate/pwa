import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import toggleCartIcon from 'Components/Navigator/actions/toggleCartIcon';
import disableNavigatorSearch from 'Components/Navigator/actions/disableNavigatorSearch';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  const cartRouteDidEnter$ = routeDidEnter(CART_PATH);

  /**
   * Gets triggered on entering the cart route.
   */
  subscribe(cartRouteDidEnter$, ({ dispatch }) => {
    dispatch(toggleCartIcon(false));
    dispatch(disableNavigatorSearch());
  });
}
