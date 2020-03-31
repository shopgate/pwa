import AppCommand from '@shopgate/pwa-core/classes/AppCommand';
import event from '@shopgate/pwa-core/classes/Event';
import logGroup from '@shopgate/pwa-core/helpers/logGroup';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  GEOLOCATION_ERROR_DENIED,
  GEOLOCATION_ERROR_TIMEOUT,
  GEOLOCATION_DEFAULT_TIMEOUT,
} from '../constants/geolocationRequest';

const LIB_VERSION = '1.0';
const COMMAND_NAME = 'getLocation';
const EVENT_NAME = 'setLocation';

/**
 * The GeolocationRequestApp class enables to retrieve the current geolocation of the device.
 * Therefore it utilizes app commands and events.
 */
class GeolocationRequestApp {
  /**
   * Constructor.
   */
  constructor() {
    /**
     * The getLocation command provide a serial parameter to identify related events. So this class
     * maintains a request queue that guarantees one event handler per dispatched command.
     */
    this.responseQueue = [];
    event.addCallback(EVENT_NAME, this.handleResponse);
  }

  /**
   * Handles responses
   * @param {Object} response Response.
   */
  handleResponse = (response) => {
    const queueEntry = this.responseQueue.shift();

    if (typeof queueEntry === 'undefined') {
      logger.error(`${EVENT_NAME} received but the response handler queue is empty.`);
      return;
    }

    logGroup('GetLocationResponse ', response, '#9a9800');

    const {
      resolve, reject, timestamp, timeout,
    } = queueEntry;

    if (typeof response !== 'undefined') {
      resolve({
        accuracy: response.accuracy,
        latitude: response.latitude,
        longitude: response.longitude,
      });

      return;
    }

    let error;
    const isTimeout = (new Date().getTime() - timestamp) > timeout;

    if (isTimeout) {
      error = new Error('Timeout expired');
      error.code = GEOLOCATION_ERROR_TIMEOUT;
    } else {
      error = new Error('User denied Geolocation');
      error.code = GEOLOCATION_ERROR_DENIED;
    }

    reject(error);
  };

  /**
   * Dispatches the request.
   * @param {number} [timeout=GEOLOCATION_DEFAULT_TIMEOUT] Timeout in ms for the request.
   * @returns {Promise}
   */
  dispatch(timeout = GEOLOCATION_DEFAULT_TIMEOUT) {
    return new Promise(async (resolve, reject) => {
      this.responseQueue.push({
        resolve,
        reject,
        timeout,
        timestamp: new Date().getTime(),
      });

      const commandParams = {
        timeout: timeout / 1000,
      };

      logGroup('GetLocationRequest', commandParams, '#9a9800');

      await new AppCommand()
        .setCommandName(COMMAND_NAME)
        .setLibVersion(LIB_VERSION)
        .setCommandParams(commandParams)
        .dispatch();
    });
  }
}

export { GeolocationRequestApp };

export default new GeolocationRequestApp();
