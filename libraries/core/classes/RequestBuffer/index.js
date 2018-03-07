/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { logger } from '../../helpers';

const REQUEST_BUFFER = 'RequestBuffer';

/**
 * The RequestBuffer class.
 * It stores instances of performing request.
 */
class RequestBuffer {
  // Holds the ongoing requests.
  requests = {};

  /**
   * Adds a new data request to the buffer store.
   * @param {Object} req The request to store.
   * @param {string} serial The serial for the request.
   */
  add(req, serial) {
    const request = this.requests[serial];

    if (request) {
      logger.error(`${REQUEST_BUFFER}: a request with the serial '${serial}' already exists!`);
      return;
    }

    this.requests[serial] = req;
  }

  /**
   * Retrieves a data request from the buffer.
   * @param {string} serial The serial for the request.
   * @returns {DataRequest}
   */
  get(serial) {
    const request = this.requests[serial];

    if (!request) {
      logger.error(`${REQUEST_BUFFER}: no stored request for the serial '${serial}' found!`);
      return null;
    }

    return request;
  }

  /**
   * Removes the data request from the buffer.
   * @param {string} serial The serial for the request.
   */
  remove(serial) {
    try {
      delete this.requests[serial];
    } catch (e) {
      logger.error(e);
    }
  }
}

export default new RequestBuffer();
