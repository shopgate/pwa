import event from '../Event';
import AppCommand from '../AppCommand';
import { logger } from '../../helpers';

/**
 * Brightness request handler.
 *
 * Maintains the request command and waits for a response to resolve a promise returned by
 * `.dispatch`.
 */
export class BrightnessRequest {
  /**
   * Creates get command.
   * @returns {AppCommand}
   */
  static makeGetCommand() {
    const command = new AppCommand();
    command.setCommandName('getCurrentBrightness');
    command.setLibVersion('17.0');
    return command;
  }

  /**
   * Constructs.
   */
  constructor() {
    this.responseEventName = 'currentBrightnessResponse';
    this.getCommand = this.constructor.makeGetCommand();
    this.responseQueue = [];
    this.counter = 0;
    event.addCallback(this.responseEventName, this.handleResponse);
  }

  /**
   * Handles responses
   * @param {Object} response Response.
   */
  handleResponse = (response) => {
    const queueEntry = this.responseQueue.shift();
    if (typeof queueEntry === 'undefined') {
      logger.error('Could not find response queue entry');
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
    return new Promise((resolve, reject) => {
      this.responseQueue.push({
        counter: this.counter,
        resolve,
        reject,
      });

      this.getCommand.dispatch();
    });
  }
}

export default new BrightnessRequest();
