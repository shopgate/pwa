/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import event from '../Event';
import { logger } from '../../helpers';
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
   * @param {function} resolve The resolve() callback of the request promise.
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

      logger.log(`webStorageResponse: ${this.name}`, { response });

      resolve(response);
    };

    // Apply the event callback.
    event.addCallback(requestCallbackName, requestCallback);

    // Send the getWebStorageEntry request.
    const command = new AppCommand();
    command
      .setCommandName('getWebStorageEntry')
      .dispatch({
        name: this.name,
        serial: this.serial,
      });
  }
}

export default WebStorageRequest;
