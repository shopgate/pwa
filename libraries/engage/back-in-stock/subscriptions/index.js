import { routeDidEnter$, routeWillEnter$ } from '@shopgate/pwa-common/streams';
import {
  backInStockRemindersDidEnter$,
} from '../streams';
import { fetchBackInStoreReminders } from '../actions';

/**
 * Category subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function backInStock(subscribe) {
  subscribe(backInStockRemindersDidEnter$, ({ dispatch }) => {
    console.log('sasa: ##################### didenter ########################');
    dispatch(fetchBackInStoreReminders());
  });
}
