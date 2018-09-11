import { cartDidEnter$, cartDidLeave$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { filterDidEnter$, filterDidLeave$ } from '@shopgate/pwa-common-commerce/filter/streams';
import enableNavigatorSearch from './actions/enableNavigatorSearch';
import disableNavigatorSearch from './actions/disableNavigatorSearch';
import toggleCartIcon from './actions/toggleCartIcon';

// Derived streams.
export const cartFilterRoutesDidEnter$ = cartDidEnter$.merge(filterDidEnter$);
export const cartFilterRoutesDidLeave$ = cartDidLeave$.merge(filterDidLeave$);

/**
 * Navigator subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function navigator(subscribe) {
  /**
   * Gets triggered when leaving the cart or filter route.
   */
  subscribe(cartFilterRoutesDidLeave$, ({ dispatch }) => {
    dispatch(toggleCartIcon(true));
    dispatch(enableNavigatorSearch());
  });

  /**
   * Gets triggered when entering the cart or filter route.
   */
  subscribe(cartFilterRoutesDidEnter$, ({ dispatch }) => {
    dispatch(toggleCartIcon(false));
    dispatch(disableNavigatorSearch());
  });
}
