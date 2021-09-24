import { DataRequest } from '@shopgate/pwa-core';
import { openPushNotification } from '../../action-creators/app';
import handleLink from './handleLink';

const PUSH_MESSAGE_OPENED = 'ajax_push_message_opened';

/**
 * Handles the opening of a push notification. If the payload contains a link, it calls
 * the openDeepLink actions additionally.
 * @param {Object} payload The push notification payload.
 * @return {Function} A redux thunk.
 */
export default function handlePushNotification(payload = {}) {
  return (dispatch) => {
    const { link = '', notificationId = null, nativeNotificationNotShown } = payload;

    /**
     * The following property is only available on iOS. A value of TRUE indicates that the push
     * message came in, while the app was open. Since the app would instantly open the link of the
     * message in those situations, the link handling is suppressed to not distract the user.
     */
    if (nativeNotificationNotShown === true) {
      return;
    }

    if (notificationId) {
      const id = notificationId.toString();

      // Send tracking event to the backend
      new DataRequest(PUSH_MESSAGE_OPENED)
        .setPayload({ notificationId: id })
        .dispatch();
    }

    dispatch(handleLink(payload, true));
    dispatch(openPushNotification(notificationId, link));
  };
}
