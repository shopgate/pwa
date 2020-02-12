import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductProperties from '../action-creators/requestProductProperties';
import { SHOPGATE_CATALOG_GET_PRODUCT_PROPERTIES } from '../constants/Pipelines';
import receiveProductProperties from '../action-creators/receiveProductProperties';
import errorProductProperties from '../action-creators/errorProductProperties';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
function fetchProductProperties(productId) {
  return (dispatch, getState) => {
    const properties = getState().product.propertiesByProductId[productId];

    if (!shouldFetchData(properties)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductProperties(productId));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_PROPERTIES)
      .setInput({ productId })
      .dispatch();

    request
      .then((result) => {
        dispatch(receiveProductProperties(productId, result.properties));
      })
      .catch((error) => {
        dispatch(errorProductProperties(productId, error.code));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductProperties);
