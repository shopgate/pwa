import event from '@shopgate/pwa-core/classes/Event';
import analyticsSetCustomValues from '@shopgate/pwa-core/commands/analyticsSetCustomValues';
import { routeDidEnter } from '@shopgate/pwa-common/streams/history';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import getCart from '../selectors/cart';
import { track, formatPurchaseData } from '../helpers/index';

/**
 * Checkout tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
  /**
   * Emits when the checkout route was entered.
   */
  const checkoutDidEnter$ = routeDidEnter(CHECKOUT_PATH);

  subscribe(checkoutDidEnter$, ({ getState }) => {
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

      const type = data.type !== 'legacy' ? 'web_PWA' : 'app_PWA';

      analyticsSetCustomValues({
        customDimensions: [{
          index: 4,
          value: type,
        }],
      });

      const formattedData = {
        ...formatPurchaseData(data.order),
        meta: {
          type,
        },
      };

      track('purchase', formattedData, getState());
    });
  });
}
