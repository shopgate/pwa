import event from '../Event';
import logGroup from '../../helpers/logGroup';
import AppCommand from '../AppCommand';
import Request from '../Request';
import requestBuffer from '../RequestBuffer';

let localSerial = 0;

/**
 * The WebStorageRequest class.
 */
class WebStorageRequest extends Request {
  /**
   * @param {string} name The name of the WebStorage entry.
   */
  constructor(name = '') {
    super();

    this.name = name;

    this.createSerial(this.name);
    this.createEventCallbackName('webStorageResponse');
  }

  /**
   * Generates the serial for this web storage request. Since the setWebStorageEntry expects
   * a number value here, the default createSerial method cannot be used by now.
   */
  createSerial() {
    // Increase the local serial and use it for the request
    localSerial += 1;
    this.serial = localSerial;
  }

  /**
   * Dispatches the web storage request.
   * @param {Function} resolve The resolve() callback of the request promise.
   */
  onDispatch(resolve) {
    // Add the request to the buffer.
    requestBuffer.add(this, this.serial);

    const requestCallbackName = this.getEventCallbackName();

    /**
     * The request event callback for the response call.
     * @param {string} serial The serial that was used to identify the DataRequest callback.
     * @param {number} age The age of the entry.
     * @param {*} value The value for the getWebStorageEntry request.
     */
    const requestCallback = (serial, age, value) => {
      event.removeCallback(requestCallbackName, requestCallback);
      requestBuffer.remove(serial);

      const response = {
        age,
        value,
      };

      logGroup(`WebStorageResponse %c${this.name}`, {
        response,
        serial: this.serial,
      }, '#f39c12');

      resolve(response);
    };

    // Apply the event callback.
    event.addCallback(requestCallbackName, requestCallback);

    logGroup(`WebStorageRequest %c${this.name}`, {
      serial: this.serial,
    }, '#e67e22');

    /**
     * Send the getWebStorageEntry request.
     * The lib version check is deactivated, since the AppCommand uses the WebStorage internally
     * to fetch the client information, which provides the current lib version of the app.
     */
    const command = new AppCommand(true, false);
    command
      .setCommandName('getWebStorageEntry')
      .dispatch({
        name: this.name,
        serial: this.serial,
      });
  }
}

export default WebStorageRequest;
