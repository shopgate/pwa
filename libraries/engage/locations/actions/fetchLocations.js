import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  requestLocations,
  receiveLocations,
  errorLocations,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_GET_LOCATIONS } from '../constants';

/**
 * @param {Object} params params.
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

export default fetchLocations;
