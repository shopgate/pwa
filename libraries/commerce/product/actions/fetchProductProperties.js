import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductProperties from '../action-creators/requestProductProperties';
import { SHOPGATE_CATALOG_GET_PRODUCT_PROPERTIES } from '../constants/Pipelines';
import receiveProductProperties from '../action-creators/receiveProductProperties';
import errorProductProperties from '../action-creators/errorProductProperties';
import { getProductProperties } from '../selectors/product';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
function fetchProductProperties(productId) {
  return (dispatch, getState) => {
    const properties = getProductProperties(getState(), { productId });

    if (!shouldFetchData(properties)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductProperties(productId));

    return new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_PROPERTIES)
      .setInput({ productId })
      .dispatch()
      .then((result) => {
        dispatch(receiveProductProperties(productId, result.properties));
        return result;
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductProperties(productId, error.code));
        return error;
      });
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductProperties);
