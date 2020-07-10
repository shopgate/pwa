import { PipelineRequest, logger } from '@shopgate/engage/core';
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
    const filters = {
      countryCode: params.countryCode,
      productCode,
    };
    if (params.geolocation) {
      filters.longitude = params.geolocation.longitude;
      filters.latitude = params.geolocation.latitude;
    }
    if (params.postalCode) {
      filters.postalCode = params.postalCode;
    }

    dispatch(requestProductLocations(productCode));

    const request = new PipelineRequest(SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS)
      .setInput(filters)
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductLocations(productCode, filters, result.locations));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductLocations(productCode, error.code));
      });

    return request;
  };
}

export default fetchProductLocations;
