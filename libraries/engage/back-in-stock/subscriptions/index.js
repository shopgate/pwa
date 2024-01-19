import {
  backInStockReminderNeedsFetch$,
} from '../streams';
import { fetchBackInStoreReminders } from '../actions';

/**
 *  subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function backInStock(subscribe) {
  subscribe(backInStockReminderNeedsFetch$, ({ dispatch }) => {
    dispatch(fetchBackInStoreReminders());
  });
}

