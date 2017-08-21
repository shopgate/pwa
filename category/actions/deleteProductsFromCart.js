import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/classes/Logger';
import {
  deleteProductsFromCart as deleteProducts,
  successDeleteProductsFromCart,
  errorDeleteProductsFromCart,
} from 'Library/action-creators/cart';
import { processMessages } from 'Library/actions/cart';
import {
  setViewLoading,
  unsetViewLoading,
} from 'Library/actions/view';
import { CART_PATH } from 'Library/constants/RoutePaths';

/**
 * Deletes products from the cart.
 * @param {Array} cartItemIds The IDs of the items to remove from the cart.
 * @return {Function} A redux thunk.
 */
const deleteProductsFromCart = cartItemIds => (dispatch) => {
  dispatch(setViewLoading(CART_PATH));
  dispatch(deleteProducts(cartItemIds));

  new PipelineRequest('deleteProductsFromCart')
    .setInput({ CartItemIds: cartItemIds })
    .dispatch()
    .then(({ messages }) => {
      dispatch(successDeleteProductsFromCart());

      if (messages) {
        dispatch(errorDeleteProductsFromCart(cartItemIds, messages));
        processMessages(dispatch, messages, 'deleteProductsFromCart');
      }
    })
    .catch((error) => {
      dispatch(errorDeleteProductsFromCart(cartItemIds));
      logger.error('deleteProductsFromCart', error);
    })
    .then(() => {
      dispatch(unsetViewLoading(CART_PATH));
    });
};

export default deleteProductsFromCart;
