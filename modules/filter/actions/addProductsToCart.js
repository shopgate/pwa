import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import logger from '@shopgate/pwa-core/classes/Logger';
import {
  addProductsToCart,
  successAddProductsToCart,
  errorAddProductsToCart,
  setCartProductPendingCount,
} from 'Library/action-creators/cart';
import { processMessages } from 'Library/actions/cart';
import {
  setViewLoading,
  unsetViewLoading,
} from 'Library/actions/view';
import { getProductPendingCount } from 'Library/selectors/cart';
import { CART_PATH } from 'Library/constants/RoutePaths';
import tracking from 'Library/tracking/core';
import getTrackingData from 'Library/tracking/data';

/**
 * Adds a product to the cart.
 * @param {Array} productData The options for the products to be added.
 * @return {Function} A redux thunk.
 */
const addToCart = productData => (dispatch, getState) => {
  const pendingProductCount = getProductPendingCount(getState());

  dispatch(setViewLoading(CART_PATH));
  dispatch(addProductsToCart(productData));
  dispatch(setCartProductPendingCount(pendingProductCount + 1));

  new PipelineRequest('addProductsToCart')
    .setInput({ products: productData })
    .dispatch()
    .then(({ messages }) => {
      dispatch(successAddProductsToCart());

      tracking.track.addToCart(getTrackingData());

      if (messages) {
        /**
         * If the addProductsToCart request fails, the pipeline doesn't respond with an error,
         * but a messages array within the response payload. So by now we also have to dispatch
         * the error action here.
         */
        dispatch(errorAddProductsToCart(productData, messages));
        processMessages(dispatch, messages, 'addProductsToCart');
      }
    })
    .catch((error) => {
      dispatch(errorAddProductsToCart(productData));
      logger.error('addProductsToCart', error);
    })
    .then(() => {
      dispatch(unsetViewLoading(CART_PATH));
    });
};

export default addToCart;
