import {
  addBackInStockReminderSuccess$,
  backInStockRemindersDidEnter$,
} from '../streams';
import { fetchBackInStoreReminders } from '../actions';

/**
 * Category subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function backInStock(subscribe) {
  subscribe(backInStockRemindersDidEnter$, ({ dispatch }) => {
    dispatch(fetchBackInStoreReminders());
  });
  subscribe(addBackInStockReminderSuccess$, ({ dispatch }) => {
    dispatch(fetchBackInStoreReminders());
  });
}

