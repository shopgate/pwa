import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { logger } from '@shopgate/pwa-core/helpers';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CART_DELETE_PRODUCTS } from '../constants/Pipelines';
import createPipelineErrorList from '../helpers/createPipelineErrorList';
import { ECART } from '../constants/PipelineErrors';
import deleteProducts from '../action-creators/deleteProductsFromCart';
import successDeleteProductsFromCart from '../action-creators/successDeleteProductsFromCart';
import errorDeleteProductsFromCart from '../action-creators/errorDeleteProductsFromCart';
import { messagesHaveErrors } from '../helpers';

/**
 * Deletes products from the cart.
 * @param {Array} cartItemIds The IDs of the items to remove from the cart.
 * @return {Function} A redux thunk.
 */
function deleteProductsFromCart(cartItemIds) {
  return (dispatch) => {
    dispatch(deleteProducts(cartItemIds));

    const request = new PipelineRequest(SHOPGATE_CART_DELETE_PRODUCTS)
      .setInput({ cartItemIds })
      .setResponseProcessed(PROCESS_SEQUENTIAL)
      .setErrorBlacklist(ECART)
      .dispatch();

    request
      .then((result) => {
        /**
         * @deprecated: The property "messages" is not supposed to be part of the pipeline response.
         * Specification demands errors to be returned as response object with an "error" property.
         * This code snippet needs to be removed after fixing the `@shopgate/legacy-cart` extension.
         */
        if (result.messages && messagesHaveErrors(result.messages)) {
          dispatch(errorDeleteProductsFromCart(cartItemIds, result.messages));
        }

        dispatch(successDeleteProductsFromCart());
      })
      .catch((error) => {
        dispatch(errorDeleteProductsFromCart(
          cartItemIds,
          createPipelineErrorList(SHOPGATE_CART_DELETE_PRODUCTS, error)
        ));
        logger.error(SHOPGATE_CART_DELETE_PRODUCTS, error);
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(deleteProductsFromCart);
