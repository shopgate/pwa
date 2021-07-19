import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import {
  requestInventories,
  receiveInventories,
  errorInventories,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_GET_INVENTORIES } from '../constants';
import { getPreferredLocation } from '../selectors';

/**
 * @param {string} productCodes The product IDs to fetch inventories for.
 * @param {string} [locationCode] locationCode.
 * @returns {Function} A redux thunk.
 */
function fetchInventories(productCodes, locationCode = null) {
  return (dispatch, getState) => {
    if (!productCodes || !productCodes.length) {
      return;
    }

    const state = getState();

    const locationFilter = locationCode || getPreferredLocation(state)?.code;
    if (!locationFilter) {
      return;
    }

    const filters = {
      products: productCodes.map(productCode => ({
        productCode,
        locationCode: locationFilter,
      })),
    };

    dispatch(requestInventories(productCodes, filters.locationCodes));

    const request = new PipelineRequest(SHOPGATE_STOREFRONT_GET_INVENTORIES)
      .setInput(filters)
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveInventories(result.productInventories));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorInventories(productCodes, error));
      });

    return request;
  };
}

export default fetchInventories;
