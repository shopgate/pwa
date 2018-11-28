import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { logger } from '@shopgate/pwa-core/helpers';
import * as pipelines from '../constants/Pipelines';
import updateProducts from '../action-creators/updateProductsInCart';
import successUpdateProductsInCart from '../action-creators/successUpdateProductsInCart';
import errorUpdateProductsInCart from '../action-creators/errorUpdateProductsInCart';
import { messagesHaveErrors } from '../helpers';

/**
 * Updates a product in the cart.
 * @param {Array} updateData The data for the updateProductsInCart request.
 * @return {Function} A redux thunk.
 */
const updateProductsInCart = updateData => (dispatch) => {
  dispatch(updateProducts(updateData));

  const request = new PipelineRequest(pipelines.SHOPGATE_CART_UPDATE_PRODUCTS);
  request.setInput({ cartItems: updateData })
    .setResponseProcessed(PROCESS_SEQUENTIAL)
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();

      if (messages && messagesHaveErrors(messages)) {
        dispatch(errorUpdateProductsInCart(updateData, messages, requestsPending));
        return;
      }

      dispatch(successUpdateProductsInCart(requestsPending));
    })
    .catch((error) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(errorUpdateProductsInCart(updateData, undefined, requestsPending));
      logger.error(pipelines.SHOPGATE_CART_UPDATE_PRODUCTS, error);
    });
};

export default updateProductsInCart;
