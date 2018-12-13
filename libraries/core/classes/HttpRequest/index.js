import { logger } from '../../helpers';
import logGroup from '../../helpers/logGroup';
import event from '../Event';
import AppCommand from '../AppCommand';
import Request from '../Request';
import requestBuffer from '../RequestBuffer';

/**
 * The http request class.
 * It sends a http request and returns a promise.
 */
class HttpRequest extends Request {
  /**
   * Initializes the HttpRequest object
   * @param {string} url The url for the request
   */
  constructor(url) {
    super();

    this.url = url;
    this.method = 'GET';
    this.followRedirects = false;
    this.timeout = 30000;

    this.payload = null;
    this.contentType = null;

    this.createSerial(this.url);
    this.createEventCallbackName('httpResponse');
  }

  /**
   * Sets the payload for the HttpRequest
   * @param {Object|string} [payload={}] The payload to send with the request
   * @returns {HttpRequest}
   */
  setPayload(payload = {}) {
    this.payload = payload;
    return this;
  }

  /**
   * Sets the contentType for the HttpRequest
   * @param {string} type The contentType for request
   * @returns {HttpRequest}
   */
  setContentType(type) {
    this.contentType = type;
    return this;
  }

  /**
   * Sets the request method
   * @param {string} method The method string
   * @return {HttpRequest}
   */
  setMethod(method) {
    if (['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
      this.method = method;
    } else {
      logger.error(`Unknown HttpRequest method: ${method}`);
    }

    return this;
  }

  /**
   * Tells if the redirects will be followed
   * @param {boolean} value The value
   * @return {HttpRequest}
   */
  setFollowRedirects(value) {
    this.followRedirects = value;
    return this;
  }

  /**
   * Sets the timeout for the request
   * @param {number} timeout The timeout
   * @return {HttpRequest}
   */
  setTimeout(timeout) {
    this.timeout = timeout;
    return this;
  }

  /**
   * Determines the right content type for the request payload
   * @private
   * @return {string} The content type
   */
  getContentType() {
    let contentType = 'text/plain';

    if (typeof this.payload === 'object') {
      contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    return contentType;
  }

  /**
   * Creates the data request body from the payload
   * @private
   * @return {string} The request body
   */
  getRequestBody() {
    /**
     * Serializes a javascript object for a data request body
     * @param {Object} obj The object that shall be serialized
     * @param {string} [prefix] An optional prefix for the object keys
     * @return {string} The serialized object
     */
    const serializeObject = (obj, prefix) => {
      const result = [];

      Object.keys(obj).forEach((propName) => {
        const key = prefix ? `${prefix}[${propName}]` : propName;
        const value = obj[propName];

        let tmp;

        if (typeof value === 'object' && value !== null) {
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
        if (this.contentType === 'application/json') {
          body = JSON.stringify(this.payload);
        } else {
          body = serializeObject(this.payload);
        }
      } else if (typeof this.payload === 'string') {
        body = this.payload;
      }
    }

    return body;
  }

  /**
   * Sends the HttpRequest and returns a promise.
   * @returns {Promise}
   */
  dispatch() {
    return new Promise((resolve, reject) => {
      const requestCallbackName = this.getEventCallbackName();

      requestBuffer.add(this, this.serial);

      // Prepare the options for the request
      const options = {
        url: this.url,
        serial: this.serial,
        method: this.method,
        timeout: this.timeout,
        followRedirects: this.followRedirects,
        body: this.getRequestBody(),
        contentType: this.contentType ? this.contentType : this.getContentType(),
      };

      /**
       * The request event callback for the response call.
       * @param {Object|null} error The error object if an error happened.
       * @param {string} serial The serial that was used to identify the HttpRequest callback
       * @param {Object} response The response for the HttpRequest
       * @return {Object}
       */
      const requestCallback = (error, serial, response) => {
        event.removeCallback(requestCallbackName, requestCallback);
        requestBuffer.remove(serial);

        logGroup(`HttpResponse %c${this.url}`, {
          options,
          error,
          response,
        });

        if (error) {
          return reject(error);
        }

        return resolve(response);
      };

      // Apply the event callback.
      event.addCallback(requestCallbackName, requestCallback);

      logGroup(`HttpRequest %c${this.url}`, { payload: this.payload });

      // Send the HttpRequest.
      const command = new AppCommand();
      command
        .setCommandName('sendHttpRequest')
        .setLibVersion('13.0')
        .dispatch(options);
    });
  }
}

export default HttpRequest;
