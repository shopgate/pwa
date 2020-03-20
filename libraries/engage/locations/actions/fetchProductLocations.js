import { PipelineRequest, logger, shouldFetchData } from '@shopgate/engage/core';
import {
  requestProductLocations,
  receiveProductLocations,
  errorProductLocations,
} from '../action-creators';
import { makeGetProductLocationsState } from '../selectors';
import { SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS } from '../constants';

/**
 * @param {string} productId The product ID to fetch locations for.
 * @param {Object} [params={}] Optional params for the location request.
 * @returns {Function} A redux thunk.
 */
function fetchProductLocations(productId, params = {}) {
  return (dispatch, getState) => {
    const getProductLocationsState = makeGetProductLocationsState();
    const productLocations = getProductLocationsState(getState())[productId];

    if (!shouldFetchData(productLocations)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductLocations(productId));

    const {
      postalCode, countryCode, longitude, latitude,
    } = params;

    const request = new PipelineRequest(SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS)
      .setInput({
        productCode: productId,
        postalCode,
        countryCode,
        longitude,
        latitude,
      })
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductLocations(productId, result.locations));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductLocations(productId, error.code));
      });

    return request;
  };
}

export default fetchProductLocations;
