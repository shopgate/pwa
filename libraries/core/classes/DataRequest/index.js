import event from '../Event';
import AppCommand from '../AppCommand';
import Request from '../Request';
import requestBuffer from '../RequestBuffer';
import { logger, ajaxUrl } from '../../helpers';

/**
 * The DataRequest class. It is the interface to the legacy system.
 */
class DataRequest extends Request {
  /**
   * Initializes the DataRequest object
   * @param {string} src The source url
   */
  constructor(src) {
    super();

    this.src = src;
    this.payload = {};
    this.noCache = true;

    this.createSerial(this.src);
    this.createEventCallbackName('dataResponse');
  }

  /**
   * Sets the payload for the DataRequest
   * @param {Object|string} [payload={}] The payload to send with the request
   * @returns {DataRequest}
   */
  setPayload(payload = {}) {
    this.payload = payload;
    return this;
  }

  /**
   * Decides if the response of the DataRequest will be cached
   * @param {boolean} [noCache=true] If set to `true`, then the DataResponse will not be cached
   * @returns {DataRequest} The DataRequest
   */
  setNoCache(noCache = true) {
    this.noCache = noCache;
    return this;
  }

  /**
   * Determines the correct content type for the request payload.
   * @return {string} The content type
   */
  getContentType() {
    let contentType = 'text/plain';

    if (
      typeof this.payload === 'object' ||
      (typeof this.payload === 'string' && this.payload.search(/_method=POST/) === 0)
    ) {
      contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    return contentType;
  }

  /**
   * Creates the data request body from the payload.
   * @return {string} The request body
   */
  getRequestBody() {
    /**
     * Serializes a JavaScript object for a data request body.
     * @param {Object} obj The object that shall be serialized.
     * @param {string} [prefix] An optional prefix for the object keys.
     * @return {string} The serialized object.
     */
    const serializeObject = (obj, prefix) => {
      const result = [];

      Object.keys(obj).forEach((propName) => {
        const key = prefix ? `${prefix}[${propName}]` : propName;
        const value = obj[propName];

        let tmp;

        if (typeof value === 'object') {
          tmp = serializeObject(value, key);
        } else {
          tmp = `${window.encodeURIComponent(key)}=${window.encodeURIComponent(value)}`;
        }

        result.push(tmp);
      });

      return result.join('&');
    };

    let body = '';

    if (this.payload) {
      if (typeof this.payload === 'object') {
        body = serializeObject(this.payload);
      } else if (typeof this.payload === 'string') {
        body = this.payload;
      }
    }

    return body;
  }

  /**
   * Dispatches the data request.
   * @param {Function} resolve The resolve() callback of the request promise.
   * @param {Function} reject The reject() callback of the request promise.
   */
  onDispatch(resolve, reject) {
    // Add the request to the buffer.
    requestBuffer.add(this, this.serial);

    const requestCallbackName = this.getEventCallbackName();

    /**
     * The request event callback for the response call.
     * @param {string} serial The serial that was used to identify the DataRequest callback..
     * @param {number} status The request status.
     * @param {string} body The response body.
     * @param {string} bodyContentType The type of data within the response body.
     * @return {Object}
     */
    const requestCallback = (serial, status, body, bodyContentType) => {
      event.removeCallback(requestCallbackName, requestCallback);
      requestBuffer.remove(serial);

      if (status !== 200) {
        return reject(status);
      }

      let responsePayload = body;

      if (bodyContentType === 'application/json; charset=UTF-8') {
        responsePayload = JSON.parse(responsePayload);
      }

      logger.log(`dataResponse: ${this.src}`, {
        status,
        responsePayload,
      });

      return resolve(responsePayload);
    };

    // Apply the event callback.
    event.addCallback(requestCallbackName, requestCallback);

    // Send the DataRequest.
    const command = new AppCommand();
    command
      .setCommandName('sendDataRequest')
      .dispatch({
        src: ajaxUrl(this.src),
        serial: this.serial,
        body: this.getRequestBody(),
        bodyContentType: this.getContentType(),
        noCache: this.noCache,
      });
  }
}

export default DataRequest;
