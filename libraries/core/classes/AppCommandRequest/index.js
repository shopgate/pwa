/* eslint-disable class-methods-use-this */
import Request from '../Request';
import AppCommand from '../AppCommand';
import event from '../Event';
import requestBuffer from '../RequestBuffer';
import { logger } from '../../helpers';
import logGroup from '../../helpers/logGroup';

const DEFAULT_LIB_VERSION = '25.0';

/**
 * The AppCommandRequest class is the base class to implement request like app commands that have a
 * corresponding app event that delivers response data.
 * It contains the logic which in necessary to establish the process of sending an
 * app command and receiving an associated event.
 */
class AppCommandRequest extends Request {
  /**
   * The constructor.
   * @param {string} commandName The name of the command which is dispatched to the app.
   * @param {string} eventName The event name which is called by the app to deliver the data.
   */
  constructor(commandName, eventName) {
    super();

    this.commandName = commandName;
    this.eventName = eventName || `${commandName}Response`;

    this.commandParams = null;

    this.libVersion = DEFAULT_LIB_VERSION;
    this.logColor = '#9a9800';

    event.registerEvent(this.eventName);

    this.createSerial(this.commandName);
    this.createEventCallbackName(this.eventName);
  }

  /**
   * Sets the parameters for the app command.
   * @param {Object} [commandParams=null] The parameters.
   * @return {AppCommandRequest}
   */
  setCommandParams(commandParams = null) {
    this.commandParams = commandParams;
    return this;
  }

  /**
   * Sets the minimum lib version for the app command.
   * @param {string} [libVersion="25.0"] The lib version.
   * @return {AppCommandRequest}
   */
  setLibVersion(libVersion = DEFAULT_LIB_VERSION) {
    this.libVersion = libVersion;
    return this;
  }

  /**
   * Cleans up the instance after a successful or failed request.
   * @private
   * @param {Function} requestCallback The event callback that processes the response.
   * @return {AppCommandRequest}
   */
  cleanUpRequest(requestCallback) {
    // Remove the event listener entry.
    event.removeCallback(this.getEventCallbackName(), requestCallback);
    // Remove the request from the buffer.
    requestBuffer.remove(this.serial);
    return this;
  }

  /**
   * Validates the command params before dispatch.
   *
   * This method is supposed to be overwritten by an inheriting class. It's invoked with the
   * currently configured command params object.
   * @param {Object} commandParams The params of the command to be dispatched
   * @return {boolean}
   */
  validateCommandParams() {
    return true;
  }

  /**
   * Creates a title for the app command request log.
   *
   * This method is supposed to be overwritten by an inheriting class to enable customization of
   * log output.
   * @returns {string}
   */
  getRequestLogTitle() {
    return `AppCommandRequest %c${this.commandName}`;
  }

  /**
   * Creates a title for the app command response log.
   *
   * This method is supposed to be overwritten by an inheriting class to enable customization of
   * log output.
   * @returns {string}
   */
  getResponseLogTitle() {
    return `AppCommandResponse %c${this.commandName}`;
  }

  /**
   * Creates payload for the app command response log.
   *
   * This default handler expects the command serial as first and the request response as
   * second command response event parameter. If the class is used for request commands with a
   * different response even payload, this method needs to be overwritten.
   * @param {string} serial The serial that was used to identify the response callback.
   * @param {Object} response The response object for the request
   * @returns {Object}
   */
  getResponseLogPayload(serial, response) {
    return response;
  }

  /**
   * App command response handler. Can be used to implement custom logic for handling the incoming
   * data.
   *
   * This default handler expects the command serial as first and the request response as
   * second command response event parameter. If the class is used for request commands with a
   * different response event payload, this method needs to be overwritten.
   * @param {Function} resolve Resolve callback of the promise returned by the dispatch method
   * of the AppCommandRequest instance.
   * @param {Function} reject Reject callback of the promise returned by the dispatch method
   * of the AppCommandRequest instance.
   * @param {string} serial The serial that was used to identify the response callback.
   * @param {Object} response The response object for the request
   */
  onResponse(resolve, reject, serial, response) {
    resolve(response);
  }

  /**
   * Dispatches the app request command.
   * @private
   * @param {Function} resolve The resolve() callback of the dispatch promise.
   * @param {Function} reject The reject() callback of the dispatch promise.
   */
  async onDispatch(resolve, reject) {
    // Validate the command parameters.
    if (this.validateCommandParams(this.commandParams) === false) {
      // In case of an error log a message and reject the request promise.
      const message = `${this.commandName} - invalid command parameters passed`;
      logger.error(message, this.commandParams);

      reject(new Error(message));
      return;
    }

    /**
     * The event callback for the command response.
     */
    const requestCallback = (...params) => {
      logGroup(
        this.getResponseLogTitle(),
        this.getResponseLogPayload(...params) || {},
        this.logColor
      );
      this.cleanUpRequest(requestCallback);
      this.onResponse(resolve, reject, ...params);
    };

    // Add the request to the buffer.
    requestBuffer.add(this, this.serial);
    // Add the event callback for the response.
    event.addCallback(this.getEventCallbackName(), requestCallback);

    // Prepare the command.
    const command = new AppCommand()
      .setCommandName(this.commandName)
      .setLibVersion(this.libVersion)
      .setCommandParams({
        serial: this.serial,
        ...this.commandParams && { ...this.commandParams },
      });

    // Try to dispatch the command.
    const success = await command.dispatch();

    // If the dispatch of the command failed revert everything and reject the promise.
    if (success === false) {
      this.cleanUpRequest(requestCallback);
      reject(new Error(`${this.commandName} command dispatch failed`));
      return;
    }

    logGroup(this.getRequestLogTitle(), this.commandParams || {}, this.logColor);
  }
}

/* eslint-enable class-methods-use-this */

export default AppCommandRequest;
