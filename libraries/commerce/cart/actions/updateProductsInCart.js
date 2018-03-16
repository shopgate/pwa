import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import updateProducts from '../action-creators/updateProductsInCart';
import successUpdateProductsInCart from '../action-creators/successUpdateProductsInCart';
import errorUpdateProductsInCart from '../action-creators/errorUpdateProductsInCart';
import { messagesHaveErrors } from '../helpers';

/**
 * Converts the update data into the format, which is currently expected by the pipeline.
 * @param {Array} updateData The original data.
 * @return {Array}
 */
const convertUpdateData = (updateData = []) => updateData.map(({ cartItemId, quantity }) => ({
  CartItemId: cartItemId,
  quantity,
}));

/**
 * Updates a product in the cart.
 * @param {Array} updateData The data for the updateProductsInCart request.
 * @return {Function} A redux thunk.
 */
const updateProductsInCart = updateData => (dispatch) => {
  // TODO: Remove, when pipeline accepts the correct format.
  const convertedData = convertUpdateData(updateData);

  dispatch(updateProducts(convertedData));

  const request = new PipelineRequest('shopgate.cart.updateProducts');
  request.setInput({ CartItem: convertedData })
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();

      if (messagesHaveErrors(messages)) {
        dispatch(errorUpdateProductsInCart(updateData, messages, requestsPending));
        return;
      }

      dispatch(successUpdateProductsInCart(requestsPending));
    })
    .catch((error) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(errorUpdateProductsInCart(updateData, undefined, requestsPending));
      logger.error('updateProductsInCart', error);
    });
};

export default updateProductsInCart;
