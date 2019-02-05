import CryptoJs from 'crypto-js';
import RequestManager from '../RequestManager';
import { logger } from '../../helpers';

// The default request manager does not cache or treat requests in any special way.
const defaultRequestManager = new RequestManager();

/**
 * The request class.
 */
class Request {
  /**
   * The constructor.
   * @param {RequestManager} [manager] The manager for this request.
   */
  constructor(manager) {
    this.serial = null;
    this.callbackName = '';
    this.manager = manager || defaultRequestManager;
  }

  /**
   * @return {boolean} Whether there are pending requests of this type.
   */
  hasPendingRequests() {
    return this.manager.pendingRequests > 0;
  }

  /**
   * Generates the serial for this data request.
   * @param {string} serialKey The serial key.
   */
  createSerial(serialKey) {
    if (!this.serial) {
      this.serial = CryptoJs.MD5(`${serialKey}${Date.now() + Math.random()}`).toString();
    }
  }

  /**
   * Creates the event callback name from the data request serial.
   * @param {string} callbackKey The callback key to use.
   */
  createEventCallbackName = (callbackKey) => {
    this.callbackName = `${callbackKey}:${this.serial}`;
  }

  /**
   * Returns the event callback name.
   * @returns {string}
   */
  getEventCallbackName() {
    return this.callbackName;
  }

  /**
   * Dispatches the request.
   * @return {Promise} A promise that is fulfilled when a response is received for this request.
   */
  dispatch() {
    return new Promise((resolve, reject) => {
      this.manager.handleDispatch(this, resolve, reject);
    });
  }

  /**
   * On timeout log error. Can be overridden by child classes.
   * @param {Function} resolve The resolve() callback of the request promise.
   * @param {Function} reject The reject() callback of the request promise.
   */
  onTimeout(resolve, reject) { // eslint-disable-line class-methods-use-this
    logger.error('Request timeout');
    reject('Request timeout');
  }
}

export default Request;
