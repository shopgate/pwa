import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  requestProductLocations,
  receiveProductLocations,
  errorProductLocations,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS } from '../constants';

/**
 * @param {string} productCode The product ID to fetch locations for.
 * @param {Object} [params={}] Optional params for the location request.
 * @returns {Function} A redux thunk.
 */
function fetchProductLocations(productCode, params = {}) {
  return (dispatch) => {
    const { postalCode, geolocation, ...restParams } = params;

    const filters = {
      productCode,
      ...restParams,
    };

    if (geolocation) {
      filters.longitude = params.geolocation.longitude;
      filters.latitude = params.geolocation.latitude;
    }

    if (postalCode) {
      filters.postalCode = params.postalCode;
    }

    dispatch(requestProductLocations(productCode, filters));

    const request = new PipelineRequest(SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS)
      .setInput(filters)
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductLocations(productCode, filters, result.locations));
      })
      .catch((error) => {
        dispatch(errorProductLocations(productCode, error.code));
      });

    return request;
  };
}

export default fetchProductLocations;
