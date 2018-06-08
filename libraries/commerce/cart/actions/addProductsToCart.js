import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { logger } from '@shopgate/pwa-core/helpers';
import * as pipelines from '../constants/Pipelines';
import addProductsToCart from '../action-creators/addProductsToCart';
import successAddProductsToCart from '../action-creators/successAddProductsToCart';
import errorAddProductsToCart from '../action-creators/errorAddProductsToCart';
import setCartProductPendingCount from '../action-creators/setCartProductPendingCount';
import { getProductPendingCount, getAddToCartOptions } from '../selectors';
import { getProductMetadata } from '../../product/selectors/product';
import { messagesHaveErrors } from '../helpers';

/**
 * Adds a product to the cart.
 * @param {Object} data The pieces for the products to be added.
 * @return {Function} A redux thunk.
 */
const addProductToCart = data => (dispatch, getState) => {
  const state = getState();
  const pendingProductCount = getProductPendingCount(state);
  const options = getAddToCartOptions(state, data);
  const metadata = getProductMetadata(state, data.productId);
  const products = [
    {
      productId: data.productId,
      quantity: data.quantity,
      ...options && { options },
      ...metadata && { metadata },
    },
  ];

  dispatch(addProductsToCart(products));
  dispatch(setCartProductPendingCount(pendingProductCount + 1));

  const request = new PipelineRequest(pipelines.SHOPGATE_CART_ADD_PRODUCTS);
  request.setInput({ products })
    .setResponseProcessed(PROCESS_SEQUENTIAL)
    .setRetries(0)
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();

      if (messagesHaveErrors(messages)) {
        /**
         * If the addProductsToCart request fails, the pipeline doesn't respond with an error,
         * but a messages array within the response payload. So by now we also have to dispatch
         * the error action here.
         */
        dispatch(errorAddProductsToCart(products, messages, requestsPending));
        return;
      }

      dispatch(successAddProductsToCart(requestsPending));
    })
    .catch((error) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(errorAddProductsToCart(products, undefined, requestsPending));
      logger.error(pipelines.SHOPGATE_CART_ADD_PRODUCTS, error);
    });
};

export default addProductToCart;
