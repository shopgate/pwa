import { main$ } from '@shopgate/pwa-common/streams/main';
import { clearOrders } from '../action-creators';
import { SUBMIT_CHECKOUT_ORDER_SUCCESS } from '../../checkout/constants/actionTypes';

/**
 * Orders subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
const orders = (subscribe) => {
  const checkoutSuccess$ = main$
    .filter(({ action }) => action.type === SUBMIT_CHECKOUT_ORDER_SUCCESS);

  subscribe(checkoutSuccess$, ({ dispatch }) => {
    dispatch(clearOrders());
  });
};

export default orders;
