import { main$ } from '@shopgate/pwa-common/streams';
import { OPEN_PUSH_NOTIFICATION } from '@shopgate/pwa-common/constants/ActionTypes';
import { userDidLogout$ } from '@shopgate/engage/user';
import { addCheckoutCampaign } from '../action-creators';
import { checkoutConfirmationDidLeave$ } from '../streams';
import { clearCheckoutOrder } from '../index';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function checkout(subscribe) {
  const pushOpened$ = main$
    .filter(({ action }) => action.type === OPEN_PUSH_NOTIFICATION);

  subscribe(checkoutConfirmationDidLeave$, ({ dispatch }) => {
    dispatch(clearCheckoutOrder());
  });

  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(clearCheckoutOrder());
  });

  subscribe(pushOpened$, ({ dispatch, action }) => {
    const { notificationId: originalNotificationId } = action;

    if (!originalNotificationId) {
      return;
    }

    const segments = originalNotificationId.split(';');

    if (segments.length === 1) {
      return;
    }

    const [campaignCode, sentTime, notificationId, locale, distributionIndex] = segments;

    const data = {
      channel: 'push',
      sentTime: Number.parseInt(sentTime, 10) || undefined,
      openedTime: Math.round(Date.now() / 1000),
      distributionIndex: null,
      campaignCode,
      notificationId,
      locale,
    };

    if (typeof distributionIndex === 'string') {
      data.distributionIndex = parseInt(distributionIndex, 10);
    }

    dispatch(addCheckoutCampaign(data));
  });
}
