import {
  GEOLOCATION_ERROR_UNKNOWN,
  GEOLOCATION_ERROR_DENIED,
  GEOLOCATION_ERROR_UNAVAILABLE,
  GEOLOCATION_ERROR_TIMEOUT,
} from '../constants/geolocationRequest';

const errorMapping = [
  GEOLOCATION_ERROR_UNKNOWN,
  GEOLOCATION_ERROR_DENIED,
  GEOLOCATION_ERROR_UNAVAILABLE,
  GEOLOCATION_ERROR_TIMEOUT,
];

export const GEOLOCATION_DEFAULT_TIMEOUT = 10000;

/**
 * The GeolocationRequest class enables to retrieve the current geolocation of the device.
 */
class GeolocationRequest {
  options = {
    timeout: 10000,
  }

  /**
   * Sets a timeout for the location request.
   * @param {number} [value=10000] The timeout in ms.
   * @returns {GeolocationRequest}
   */
  setTimeout(value = GEOLOCATION_DEFAULT_TIMEOUT) {
    this.options.timeout = value;
    return this;
  }

  /**
   * Dispatches the request. If no further provisions are made, it will trigger the geolocation
   * permission dialog if permissions are not already granted.
   * @returns {Promise}
   */
  dispatch() {
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
      }, this.options);
    });
  }
}

export default GeolocationRequest;
