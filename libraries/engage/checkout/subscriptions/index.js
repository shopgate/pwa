import {
  main$, routeDidLeave$, historyPop, showModal,
} from '@shopgate/engage/core';

import { CHECKOUT_CONFIRMATION_PATTERN } from '../constants';
import { FETCH_CHECKOUT_ORDER_ERROR } from '../constants/actionTypes';
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

  const failedToFetchOrder$ = main$
    .filter(({ action }) => action.type === FETCH_CHECKOUT_ORDER_ERROR);

  subscribe(failedToFetchOrder$, ({ dispatch }) => {
    dispatch(historyPop());
    dispatch(showModal({
      title: null,
      confirm: null,
      dismiss: 'modal.ok',
      message: 'checkout.errors.initFailed',
    }));
  });
}
