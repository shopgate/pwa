import event from '../Event';
import AppCommand from '../AppCommand';
import { logger } from '../../helpers';

const LIB_VERSION = '17.0';
const GET_COMMAND_NAME = 'getCurrentBrightness';
const RESPONSE_EVENT_NAME = 'currentBrightnessResponse';

/**
 * Brightness request handler.
 *
 * Maintains the request command and waits for a response to resolve a promise returned by
 * `.dispatch`.
 */
export class BrightnessRequest {
  /**
   * Constructor.
   */
  constructor() {
    this.responseQueue = [];
    event.addCallback(RESPONSE_EVENT_NAME, this.handleResponse);
  }

  /**
   * Handles responses
   * @param {Object} response Response.
   */
  handleResponse = (response) => {
    const queueEntry = this.responseQueue.shift();

    if (typeof queueEntry === 'undefined') {
      logger.error('currentBrightnessResponse received but the response handler queue is empty.');
      return;
    }

    const { resolve, reject } = queueEntry;

    if (!response.hasOwnProperty('brightness')) {
      reject(new Error('Invalid response for currentBrightnessResponse. Missing brightness property.'));
      return;
    }

    resolve(response.brightness);
  };

  /**
   * Dispatches the request.
   * @returns {Promise}
   */
  dispatch() {
    return new Promise(async (resolve, reject) => {
      this.responseQueue.push({
        resolve,
        reject,
      });

      // Prepare the AppComand.
      const command = new AppCommand()
        .setCommandName(GET_COMMAND_NAME)
        .setLibVersion(LIB_VERSION);

      // Dispatch the command. The method will resolve with FALSE in case of an error.
      const result = await command.dispatch();

      if (result === false) {
        // Remove the queue entry when the dispatch failed.
        this.responseQueue.pop();
        reject(new Error('getCurrentBrightness command dispatch failed'));
      }
    });
  }
}

export default new BrightnessRequest();
