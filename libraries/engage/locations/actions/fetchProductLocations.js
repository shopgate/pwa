import { PipelineRequest, logger, shouldFetchData } from '@shopgate/engage/core';
import {
  requestProductLocations,
  receiveProductLocations,
  errorProductLocations,
} from '../action-creators';
import { makeGetProductLocations } from '../selectors';
import { SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS } from '../constants';

/**
 * @param {string} productId The product ID to fetch locations for.
 * @returns {Function} A redux thunk.
 */
function fetchProductLocations(productId) {
  return (dispatch, getState) => {
    const getProductLocations = makeGetProductLocations();
    const productLocations = getProductLocations(getState(), { productId });

    if (!shouldFetchData(productLocations)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductLocations(productId));

    const request = new PipelineRequest(SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS)
      .setInput({
        productCode: productId,
        // postalCode: '35510', // TODO: only temporary until the zipcode search is implemented.
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
