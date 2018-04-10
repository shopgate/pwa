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
    this.lastRequestSerial = 0;
    this.lastResponseSerial = 0;
    this.responseQueue = {};
    event.addCallback(this.responseEventName, this.handleResponse);
  }

  /**
   * Handles responses
   * @param {Object} response Response.
   */
  handleResponse = (response) => {
    this.lastResponseSerial += 1;
    if (!this.responseQueue.hasOwnProperty(this.lastResponseSerial)) {
      this.lastResponseSerial -= 1;
      logger.error(`Could not find response queue for ${this.lastResponseSerial}`);
      return;
    }
    const { resolve, reject } = this.responseQueue[this.lastResponseSerial];
    // Deleting a reference.
    delete this.responseQueue[this.lastResponseSerial];
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
    this.lastRequestSerial += 1;
    const currentSerial = this.lastRequestSerial;
    return new Promise((resolve, reject) => {
      this.responseQueue[currentSerial] = {
        resolve,
        reject,
      };
      this.getCommand.dispatch();
    });
  }
}

export default new BrightnessRequest();
