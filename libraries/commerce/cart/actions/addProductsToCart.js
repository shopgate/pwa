import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { logger } from '@shopgate/pwa-core/helpers';
import * as pipelines from '../constants/Pipelines';
import addProductsToCart from '../action-creators/addProductsToCart';
import successAddProductsToCart from '../action-creators/successAddProductsToCart';
import errorAddProductsToCart from '../action-creators/errorAddProductsToCart';
import setCartProductPendingCount from '../action-creators/setCartProductPendingCount';
import { getProductPendingCount, getAddToCartMetadata } from '../selectors';
import { getProductById } from '../../product/selectors/product';
import { messagesHaveErrors } from '../helpers';

/**
 * Adds a product to the cart. Includes metadata if available and not provided before.
 * @param {Array} productData The options for the products to be added.
 * @return {Function} A redux thunk.
 */
const addToCart = productData => (dispatch, getState) => {
  const state = getState();
  const pendingProductCount = getProductPendingCount(state);
  const products = productData.map(product => {
    const { productData } = getProductById(state, product.productId);
    const productId = productData.baseProductId || product.productId;

    // it's a variant if it has a baseProductId
    const variantProductId = productData.baseProductId ? productData.id : undefined;
    const metadata = getAddToCartMetadata(state, productId, variantProductId);
    return product.metadata && product || {
      ...product,
      ...(metadata) && { metadata },
    }
  })

  dispatch(addProductsToCart(products));
  dispatch(setCartProductPendingCount(pendingProductCount + 1));

  const request = new PipelineRequest(pipelines.SHOPGATE_CART_ADD_PRODUCTS);

  request.setInput({ products })
    .setResponseProcessed(PROCESS_SEQUENTIAL)
    .setRetries(0)
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();

      if (messages && messagesHaveErrors(messages)) {
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

export default addToCart;
