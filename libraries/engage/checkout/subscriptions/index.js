import { routeDidLeave$ } from '@shopgate/engage/core';
import { userDidLogout$ } from '@shopgate/engage/user';
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

  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(clearCheckoutOrder());
  });
}
