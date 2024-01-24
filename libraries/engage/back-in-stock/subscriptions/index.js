import {
  backInStockReminderNeedsFetch$,
} from '../streams';
import { fetchBackInStoreSubscriptions } from '../actions';

/**
 *  subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function backInStock(subscribe) {
  subscribe(backInStockReminderNeedsFetch$, ({ dispatch }) => {
    dispatch(fetchBackInStoreSubscriptions());
  });
}

