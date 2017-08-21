import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/classes/Logger';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import {
  requestProductDescription,
  receiveProductDescription,
  errorProductDescription,
} from '../action-creators/';

/**
 * Maybe requests a product description from server.
 * @param {string} productId The product ID.
 * @return {Function} The dispatched action.
 */
const getProductDescription = productId => (dispatch, getState) => {
  const state = getState();
  const description = state.product.descriptionsByProductId[productId];

  if (!shouldFetchData(description)) {
    return;
  }

  dispatch(requestProductDescription(productId));

  new PipelineRequest('getProductDescription')
    .setInput({ productId })
    .dispatch()
      .then(result => dispatch(receiveProductDescription(productId, result.description)))
      .catch((error) => {
        logger.error(error);
        dispatch(errorProductDescription(productId));
      });
};

export default getProductDescription;
