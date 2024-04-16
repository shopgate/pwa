import {
  pushNotificationOpened$,
  deeplinkOpened$,
  universalLinkOpened$,
} from '@shopgate/pwa-common/streams/app';
import { track } from '../helpers/index';

/**
 * Deeplink and push message tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function deeplinkPush(subscribe) {
  /**
   * Gets triggered when a deeplink was opened.
   */
  subscribe(deeplinkOpened$, ({ getState, action }) => {
    const state = getState();
    const { link = '', sourceApp = '', wasOpenedFromSearchIndex } = action.payload;
    const eventLabel = wasOpenedFromSearchIndex ? 'os_search' : sourceApp;

    track('openDeepLink', {
      eventAction: link,
      eventLabel,
    }, state);

    track('setCampaignWithUrl', {
      url: link,
      type: 'deeplink',
    }, state);
  });

  /**
   * Gets triggered when a push was opened.
   */
  subscribe(pushNotificationOpened$, ({ getState, action }) => {
    const state = getState();
    const notificationId = action.notificationId ? action.notificationId.toString() : 'n/a';

    track('openPushNotification', {
      eventAction: 'opened',
      eventLabel: notificationId,
    }, state);

    track('setCampaignWithUrl', {
      url: action.link,
      notificationId,
      type: 'push_message',
    }, state);
  });

  /**
   * Gets triggered when a universal link was opened.
   */
  subscribe(universalLinkOpened$, ({ getState, action }) => {
    const state = getState();
    const { link = '', wasOpenedFromSearchIndex } = action.payload;
    const eventLabel = wasOpenedFromSearchIndex ? 'os_search' : 'n/a';

    track('openUniversalLink', {
      eventAction: link,
      eventLabel,
    }, state);

    track('setCampaignWithUrl', {
      url: link,
      type: 'universal_link',
    }, state);
  });
}
