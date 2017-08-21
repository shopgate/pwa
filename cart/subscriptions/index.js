import { userDidUpdate$ } from '@shopgate/pwa-common/streams/user';
import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { getCart } from '../actions';
import { remoteCartDidUpdate$ } from '../streams';
import { setCartProductPendingCount } from '../action-creators';

/**
 * Cart subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  /**
   * Gets triggered when ever the local cart is out of
   * sync with the remote cart from the server.
   */
  const cartNeedsSync$ = userDidUpdate$.merge(remoteCartDidUpdate$);

  subscribe(cartNeedsSync$, ({ dispatch }) => {
    dispatch(getCart());
  });

  /**
   * Gets triggered when the app starts.
   */
  subscribe(appDidStart$, ({ dispatch }) => {
    // Reset the productPendingCount on app start to avoid a wrong value in the cart badge.
    dispatch(setCartProductPendingCount(0));
  });
}
