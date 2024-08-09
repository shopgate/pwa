import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import {
  requestLocations,
  receiveLocations,
  errorLocations,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_GET_LOCATIONS } from '../constants';

/**
 * Returns a list of locations based on search options & defaults. Including geographical radial
 * distance & other merchant configurations
 * @param {Object} params Function params
 * @param {string} [params.postalCode] A postal code
 * @param {string} [params.countryCode] Indicates to which country the postal code belongs.
 * Is required if the postalCode parameter is set
 * @param {Object} [params.geolocation] A geolocation object
 * @param {string} params.geolocation.longitude Longitude to search by coordinates. Works only in
 * combination with radius and latitude.
 * @param {string} params.geolocation.latitude Latitude to search by coordinates. Works only in
 * combination with radius and longitude.
 * @param {number} [params.radius] Used only with geolocation.longitude & geolocation.latitude.
 * @param {string[]} [params.codes] Search by location codes. This cannot be combined with
 * coordinate search or a postal code search
 * @param {boolean} [params.enableInLocationFinder=false] When set to `true` only locations are
 * returned which are enabled for the location finder.
 * @returns {Function} A redux thunk.
 */
function fetchLocations(params) {
  return (dispatch) => {
    dispatch(requestLocations(params));

    const filters = { countryCode: params.countryCode };
    if (params.geolocation) {
      filters.longitude = params.geolocation.longitude;
      filters.latitude = params.geolocation.latitude;
    }
    if (params.postalCode) {
      filters.postalCode = params.postalCode;
    }

    if (params.enableInLocationFinder) {
      filters.enableInLocationFinder = params.enableInLocationFinder;
    }

    if (params.radius) {
      filters.radius = params.radius;
    }

    if (params.codes) {
      filters.codes = params.codes;
    }

    const request = new PipelineRequest(SHOPGATE_STOREFRONT_GET_LOCATIONS)
      .setInput(filters)
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveLocations(filters, result.locations));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorLocations(params, error));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchLocations);
