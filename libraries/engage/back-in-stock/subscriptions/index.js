import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { fetchBackInStockSubscriptions } from '@shopgate/engage/back-in-stock/actions';
import {
  addBackInStockReminderSuccess$,
  backInStockReminderNeedsFetch$,
} from '@shopgate/engage/back-in-stock/streams';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function backInStock(subscribe) {
  subscribe(backInStockReminderNeedsFetch$, ({ dispatch }) => {
    dispatch(fetchBackInStockSubscriptions());
  });

  subscribe(addBackInStockReminderSuccess$, ({ dispatch }) => {
    dispatch(showModal({
      title: 'back_in_stock.add_back_in_stock_success_modal.title',
      message: 'back_in_stock.add_back_in_stock_success_modal.message',
      confirm: 'modal.confirm',
      dismiss: null,
    }));
  });
}

