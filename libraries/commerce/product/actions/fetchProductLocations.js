import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import requestProductLocations from '../action-creators/requestProductLocations';
import receiveProductLocations from '../action-creators/receiveProductLocations';
import errorProductLocations from '../action-creators/errorProductLocations';
import { makeGetProductLocations } from '../selectors/locations';
import * as pipelines from '../constants/Pipelines';

/**
 * @param {string} productId The product ID to fetch locations for.
 * @returns {Function} A redux thunk.
 */
export function fetchProductLocations(productId) {
  return (dispatch, getState) => {
    const getProductLocations = makeGetProductLocations();
    const productLocations = getProductLocations(getState(), { productId });

    if (!shouldFetchData(productLocations)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductLocations(productId));

    const request = new PipelineRequest(pipelines.SHOPGATE_STOREFRONT_GET_PRODUCT_LOCATIONS)
      .setInput({
        productCode: productId,
      })
      .dispatch()
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
