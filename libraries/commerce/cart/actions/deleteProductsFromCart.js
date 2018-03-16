import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import deleteProducts from '../action-creators/deleteProductsFromCart';
import successDeleteProductsFromCart from '../action-creators/successDeleteProductsFromCart';
import errorDeleteProductsFromCart from '../action-creators/errorDeleteProductsFromCart';
import { messagesHaveErrors } from '../helpers';

/**
 * Deletes products from the cart.
 * @param {Array} cartItemIds The IDs of the items to remove from the cart.
 * @return {Function} A redux thunk.
 */
const deleteProductsFromCart = cartItemIds => (dispatch) => {
  dispatch(deleteProducts(cartItemIds));

  const request = new PipelineRequest('shopgate.cart.deleteProducts');
  request.setInput({ CartItemIds: cartItemIds })
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();

      if (messagesHaveErrors(messages)) {
        dispatch(errorDeleteProductsFromCart(cartItemIds, messages, requestsPending));
      }

      dispatch(successDeleteProductsFromCart(requestsPending));
    })
    .catch((error) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(errorDeleteProductsFromCart(cartItemIds, undefined, requestsPending));
      logger.error('deleteProductsFromCart', error);
    });
};

export default deleteProductsFromCart;
