import { UIEvents } from '../../../core';
import { EVENT_LIVE_MESSAGE, LIVE_MESSAGE_TYPE_POLITE } from './constants';

/**
 * Broadcasts a live message to a LiveMessenger component.
 * @param {string} message The message.
 * @param {Object} options Additional options.
 * @param {string} options.type Type of the message
 * @param {Object} options.params Message params for an i18n placeholder message.
 * @param {string} options.id Id of the LiveMessenger component which sets the message.
 * @param {boolean} options.force If set to TRUE the LiveMessenger component will read the text,
 * even if the same was broadcasted before.
 */
export function broadcastLiveMessage(message, options = {}) {
  const defaults = {
    type: LIVE_MESSAGE_TYPE_POLITE,
    params: null,
    id: null,
    force: false,
  };

  if (!message) {
    return;
  }

  const params = {
    ...defaults,
    ...options,
  };

  if (params.force) {
    // Clear the text first, so that the message will be read in any case.
    UIEvents.emit(EVENT_LIVE_MESSAGE, '', params);

    setTimeout(() => {
      UIEvents.emit(EVENT_LIVE_MESSAGE, message, params);
    }, 0);
    return;
  }

  UIEvents.emit(EVENT_LIVE_MESSAGE, message, params);
}
