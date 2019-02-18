import event from '@shopgate/pwa-core/classes/Event';
import analyticsSetCustomValues from '@shopgate/pwa-core/commands/analyticsSetCustomValues';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import getCart from '../selectors/cart';
import { track, formatPurchaseData } from '../helpers';
import { checkoutDidEnter$ } from '../streams/checkout';

/**
 * Checkout tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function checkout(subscribe) {
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
