import { main$ } from '@shopgate/pwa-common/streams';
import { OPEN_PUSH_NOTIFICATION } from '@shopgate/pwa-common/constants/ActionTypes';
import { routeDidLeave$ } from '@shopgate/engage/core';
import { userDidLogout$ } from '@shopgate/engage/user';
import { addCheckoutCampaign } from '../action-creators';
import { CHECKOUT_CONFIRMATION_PATTERN } from '../constants';
import { clearCheckoutOrder } from '../index';

/**
 * @param {Function} subscribe Subscribes to an observable.
 */
export default function checkout(subscribe) {
  const checkoutConfirmationDidLeave$ = routeDidLeave$
    .filter(({ action }) => action.route.pattern === CHECKOUT_CONFIRMATION_PATTERN);

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
