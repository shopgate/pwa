import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import requestProductProperties from '../action-creators/requestProductProperties';
import * as pipelines from '../constants/Pipelines';
import receiveProductProperties from '../action-creators/receiveProductProperties';
import errorProductProperties from '../action-creators/errorProductProperties';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
const fetchProductProperties = productId => (dispatch, getState) => {
  const state = getState();
  const properties = state.product.propertiesByProductId[productId];

  if (!shouldFetchData(properties)) {
    return;
  }

  dispatch(requestProductProperties(productId));

  new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_PROPERTIES)
    .setInput({ productId })
    .dispatch()
    .then(result => dispatch(receiveProductProperties(productId, result.properties)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductProperties(productId, error.code));
    });
};

/** @mixes {MutableFunction} */
export default mutable(fetchProductProperties);
