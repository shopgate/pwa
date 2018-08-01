import event from '@shopgate/pwa-core/classes/Event';
import analyticsSetCustomValues from '@shopgate/pwa-core/commands/analyticsSetCustomValues';
import { routeDidEnter$ } from '@shopgate/pwa-common/streams/router';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import getCart from '../selectors/cart';
import { track, formatPurchaseData, setPWAVisibleState } from '../helpers';

/**
 * Checkout tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  const checkoutDidEnter$ = routeDidEnter$
    .filter(({ action }) => action.route.pattern === CHECKOUT_PATH);

  subscribe(checkoutDidEnter$, ({ getState }) => {
    setPWAVisibleState(false);

    const state = getState();

    track('initiatedCheckout', { cart: getCart(state) }, state);
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ getState }) => {
    event.addCallback('checkoutSuccess', (data = {}) => {
      if (typeof data.order === 'undefined') {
        return;
      }

      const source = data.type !== 'legacy' ? 'web_PWA' : 'app_PWA';

      analyticsSetCustomValues({
        customDimensions: [{
          index: 4,
          value: source,
        }],
      });

      const formattedData = {
        ...formatPurchaseData(data.order),
        meta: {
          source,
        },
      };

      track('purchase', formattedData, getState());
    });
  });
}
