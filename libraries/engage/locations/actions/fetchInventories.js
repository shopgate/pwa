import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import {
  requestInventories,
  receiveInventories,
  errorInventories,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_GET_INVENTORIES } from '../constants';
import { getPreferredLocation } from '../selectors';

/**
 * Fetches location inventory for a list of products.
 * @param {string[]} productCodes The product IDs to fetch inventories for.
 * @param {string} [locationCode] A location code
 * @returns {Function} A redux thunk.
 */
function fetchInventories(productCodes, locationCode = null) {
  return (dispatch, getState) => {
    if (!productCodes || !productCodes.length) {
      return undefined;
    }

    const state = getState();

    const locationFilter = locationCode || getPreferredLocation(state)?.code;
    if (!locationFilter) {
      return undefined;
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

/** @mixes {MutableFunction} */
export default mutable(fetchInventories);
