import { UIEvents } from '@shopgate/pwa-core';
import { EVENT_LIVE_MESSAGE, LIVE_MESSAGE_TYPE_POLITE } from './constants';

/**
 * Broadcasts a live message to a LiveMessenger component.
 * @param {string} message The message.
 * @param {Object} options Additional options.
 * @param {string} options.type Type of the message
 * @param {Object} options.params Message params for an i18n placeholder message.
 * @param {string} options.id Id of the LiveMessage component which sets the message.
 */
export function broadcastLiveMessage(message, options = {}) {
  const defaults = {
    type: LIVE_MESSAGE_TYPE_POLITE,
    params: null,
    id: null,
    force: false,
  };

  const params = {
    ...defaults,
    ...options,
  };

  if (params.force) {
    UIEvents.emit(EVENT_LIVE_MESSAGE, '', params);

    setTimeout(() => {
      UIEvents.emit(EVENT_LIVE_MESSAGE, message, params);
    }, 0);
    return;
  }

  UIEvents.emit(EVENT_LIVE_MESSAGE, message, params);
}
