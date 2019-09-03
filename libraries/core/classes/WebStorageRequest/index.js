import event from '../Event';
import { logger } from '../../helpers';
import logGroup from '../../helpers/logGroup';
import Request from '../Request';
import requestBuffer from '../RequestBuffer';
import Bridge from '../Bridge';

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
    this.params = null;

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
   * @return {boolean}
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

    const params = {
      name: this.name,
      serial: this.serial,
    };
    const command = {
      c: 'getWebStorageEntry',
      p: params,
    };

    const bridge = new Bridge();

    try {
      bridge.dispatchCommand(command, '9.0');
    } catch (exception) {
      logger.error(exception);
      return false;
    }

    return true;
  }
}

export default WebStorageRequest;
