import {
  event,
} from '@shopgate/engage/core/classes';
import {
  appDidStart$,
} from '@shopgate/engage/core/streams';
import {
  analyticsSetCustomValues,
} from '@shopgate/engage/core/commands';
import {
  checkoutSuccess$,
} from '@shopgate/engage/checkout/streams';
import getCart from '../selectors/cart';
import { track, formatPurchaseData, formatNativeCheckoutPurchaseData } from '../helpers';
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

  subscribe(checkoutSuccess$, ({ getState, action }) => {
    const { order } = action;
    if (typeof order === 'undefined') {
      return;
    }

    const source = order?.platform === 'desktop' ? 'web_PWA' : 'app_PWA';

    analyticsSetCustomValues({
      customDimensions: [{
        index: 4,
        value: source,
      }],
    });

    const formattedData = {
      ...formatNativeCheckoutPurchaseData(order),
      meta: {
        source,
      },
    };

    track('purchase', formattedData, getState());
  });
}
