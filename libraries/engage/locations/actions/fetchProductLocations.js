import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import {
  requestProductLocations,
  receiveProductLocations,
  errorProductLocations,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS } from '../constants';

/**
 * Returns a list of locations and item availability for a given product
 * @param {string} productCode The product ID to fetch locations for.
 * @param {Object} [params={}] Optional params for the location request.
 * @param {string} [params.postalCode] A postal code
 * @param {Object} [params.geolocation] A geolocation object
 * @param {string} params.geolocation.longitude Longitude to search by coordinates. Works only in
 * combination with latitude.
 * @param {string} params.geolocation.latitude Latitude to search by coordinates. Works only in
 * combination with longitude.
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

/** @mixes {MutableFunction} */
export default mutable(fetchProductLocations);
