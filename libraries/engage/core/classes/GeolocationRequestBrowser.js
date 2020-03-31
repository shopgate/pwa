import {
  GEOLOCATION_ERROR_UNKNOWN,
  GEOLOCATION_ERROR_DENIED,
  GEOLOCATION_ERROR_UNAVAILABLE,
  GEOLOCATION_ERROR_TIMEOUT,
  GEOLOCATION_DEFAULT_TIMEOUT,
} from '../constants/geolocationRequest';

const errorMapping = [
  GEOLOCATION_ERROR_UNKNOWN,
  GEOLOCATION_ERROR_DENIED,
  GEOLOCATION_ERROR_UNAVAILABLE,
  GEOLOCATION_ERROR_TIMEOUT,
];

/* eslint-disable class-methods-use-this */

/**
 * The GeolocationRequestBrowser class enables to retrieve the current geolocation of the device.
 */
class GeolocationRequestBrowser {
  /**
   * Dispatches the request. If no further provisions are made, it will trigger the geolocation
   * permission dialog if permissions are not already granted.
   * @param {number} [timeout=GEOLOCATION_DEFAULT_TIMEOUT] Timeout in ms for the request.
   * @returns {Promise}
   */
  dispatch(timeout = GEOLOCATION_DEFAULT_TIMEOUT) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position;
        resolve({
          accuracy: coords.accuracy,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }, ({ code, message }) => {
        const error = new Error(message);
        error.code = errorMapping[code];

        reject(error);
      }, {
        timeout,
      });
    });
  }
}

export { GeolocationRequestBrowser };

/* eslint-enable class-methods-use-this */
export default new GeolocationRequestBrowser();
