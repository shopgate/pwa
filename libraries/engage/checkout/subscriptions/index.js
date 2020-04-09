import { routeDidLeave$ } from '@shopgate/pwa-common/streams/router';
import { CHECKOUT_CONFIRMATION_PATTERN } from '../constants';
import { clearCheckoutOrder } from '../index';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function checkout(subscribe) {
  const checkoutConfirmationDidLeave$ = routeDidLeave$
    .filter(({ action }) => action.route.pattern === CHECKOUT_CONFIRMATION_PATTERN);

  subscribe(checkoutConfirmationDidLeave$, ({ dispatch }) => {
    dispatch(clearCheckoutOrder());
  });
}
