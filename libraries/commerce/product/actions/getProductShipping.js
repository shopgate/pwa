import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import requestProductShipping from '../action-creators/requestProductShipping';
import receiveProductShipping from '../action-creators/receiveProductShipping';
import errorProductShipping from '../action-creators/errorProductShipping';

/**
 * Retrieves product shipping from the store.
 * @param {string} productId The product ID for which the product shipping is requested.
 * @return {Function} A Redux Thunk
 */
const getProductShipping = productId => (dispatch, getState) => {
  const state = getState();
  const shipping = state.product.shippingByProductId[productId];

  if (!shouldFetchData(shipping)) {
    return;
  }

  dispatch(requestProductShipping(productId));

  new PipelineRequest('shopgate.catalog.getProductShipping')
    .setInput({ productId })
    .dispatch()
    .then(result => dispatch(receiveProductShipping(productId, result.shipping)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductShipping(productId));
    });
};

export default getProductShipping;
