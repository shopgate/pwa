import { appWillInit$ } from '@shopgate/engage/core';
import { PERMISSION_ID_PUSH } from '@shopgate/engage/core/constants';
import { appInitialization } from '@shopgate/engage/core/collections';
import { requestAppPermissionStatus } from '@shopgate/engage/core/actions';
import showModal from '@shopgate/pwa-common/actions/modal/showModal';
import { fetchBackInStockSubscriptions } from '@shopgate/engage/back-in-stock/actions';
import {
  addBackInStockReminderSuccess$,
  backInStockReminderNeedsFetch$,
} from '@shopgate/engage/back-in-stock/streams';
import {
  getIsBackInStockEnabled,
  getAreBackInStockRequestsPossible,
} from '@shopgate/engage/back-in-stock/selectors';

/**
 * @param {Function} subscribe The subscribe function.
 */
export default function backInStock(subscribe) {
  subscribe(appWillInit$, () => {
    /**
     * Back-in-stock requests are only possible when users granted push permissions. Otherwise
     * the backend will not be able to assign the subscriptions to a device.
     *
     * So in the next block we register a new handler to the "appInitialization" collection which
     * will retrieve the current status of the push permission before the React app starts.
     *
     * The back-in-stock reducer will store the status, so that selectors can work with it.
     */
    appInitialization.set('back-in-stock', async ({ dispatch, getState }) => {
      const isEnabled = getIsBackInStockEnabled(getState());

      if (isEnabled) {
        await dispatch(requestAppPermissionStatus({
          permissionId: PERMISSION_ID_PUSH,
        }));
      }
    });
  });

  subscribe(backInStockReminderNeedsFetch$, ({ dispatch, getState }) => {
    const requestsPossible = getAreBackInStockRequestsPossible(getState());

    if (requestsPossible) {
      dispatch(fetchBackInStockSubscriptions());
    }
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

