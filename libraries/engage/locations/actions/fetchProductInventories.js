import { logger } from '@shopgate/pwa-core/helpers';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import {
  requestProductInventories,
  receiveProductInventories,
  errorProductInventories,
} from '../action-creators';
import { SHOPGATE_STOREFRONT_GET_PRODUCT_INVENTORIES } from '../constants';

/**
 * Fetches inventories for a product
 * @param {string} productCode The product ID to fetch inventories for.
 * @param {Object} [params={}] Optional params for the inventories request.
 * @param {string[]} params.locationCodes A list of location codes.
 * @returns {Function} A redux thunk.
 */
function fetchProductInventories(productCode, params = {}) {
  return (dispatch) => {
    const filters = {
      locationCodes: params.locationCodes,
      productCode,
    };

    dispatch(requestProductInventories(productCode, filters.locationCodes));

    const request = new PipelineRequest(SHOPGATE_STOREFRONT_GET_PRODUCT_INVENTORIES)
      .setInput(filters)
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductInventories(
          productCode, filters.locationCodes, result.inventories
        ));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductInventories(productCode, error.code));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductInventories);
