import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/classes/Logger';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import {
  requestProductProperties,
  receiveProductProperties,
  errorProductProperties,
} from '../action-creators';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
const getProductProperties = productId => (dispatch, getState) => {
  const state = getState();
  const properties = state.product.propertiesByProductId[productId];

  if (!shouldFetchData(properties)) {
    return;
  }

  dispatch(requestProductProperties(productId));

  new PipelineRequest('getProductProperties')
    .setInput({ productId })
    .dispatch()
      .then(result => dispatch(receiveProductProperties(productId, result.properties)))
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductProperties(productId));
      });
};

export default getProductProperties;
