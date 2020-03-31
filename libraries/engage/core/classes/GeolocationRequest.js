import geolocationRequestBrowser from './GeolocationRequestBrowser';
import geolocationRequestApp from './GeolocationRequestApp';
import { GEOLOCATION_DEFAULT_TIMEOUT } from '../constants/geolocationRequest';

/**
 * The GeolocationRequest class enables to retrieve the current geolocation of the device.
 * @deprecated
 */
class GeolocationRequest {
  /**
   * Constructor
   * @param {boolean} [useBrowserAPI=true] Wether the browser API or app commands a supposed to
   * be used to determine the geolocation.
   */
  constructor(useBrowserAPI = true) {
    this.useBrowserAPI = useBrowserAPI;

    this.options = {
      timeout: GEOLOCATION_DEFAULT_TIMEOUT,
    };
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
    const instance = this.useBrowserAPI ? geolocationRequestBrowser : geolocationRequestApp;
    return instance.dispatch(this.options.timeout);
  }
}

export default GeolocationRequest;
