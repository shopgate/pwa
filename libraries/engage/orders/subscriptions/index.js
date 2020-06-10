import { userDidLogout$ } from '@shopgate/engage/user';
import { clearOrders } from '../action-creators';

/**
 * Orders subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
const orders = (subscribe) => {
  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(clearOrders());
  });
};

export default orders;
