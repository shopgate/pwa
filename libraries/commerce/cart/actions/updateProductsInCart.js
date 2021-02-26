import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import configuration from '@shopgate/pwa-common/collections/Configuration';
import { PIPELINES } from '@shopgate/pwa-common/constants/Configuration';
import { SHOPGATE_CART_UPDATE_PRODUCTS } from '../constants/Pipelines';
import createPipelineErrorList from '../helpers/createPipelineErrorList';
import { ECART } from '../constants/PipelineErrors';
import updateProducts from '../action-creators/updateProductsInCart';
import successUpdateProductsInCart from '../action-creators/successUpdateProductsInCart';
import errorUpdateProductsInCart from '../action-creators/errorUpdateProductsInCart';
import { messagesHaveErrors, createErrorMessageList } from '../helpers';

/**
 * Updates a product in the cart.
 * @param {Array} updateData The data for the updateProductsInCart request.
 * @return {Function} A redux thunk.
 */
function updateProductsInCart(updateData) {
  return async (dispatch) => {
    const {
      [SHOPGATE_CART_UPDATE_PRODUCTS]: pipeline = SHOPGATE_CART_UPDATE_PRODUCTS,
    } = configuration.get(PIPELINES, {});

    dispatch(updateProducts(updateData));

    const request = new PipelineRequest(pipeline)
      .setInput({ cartItems: updateData })
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
          dispatch(errorUpdateProductsInCart(
            updateData,
            createErrorMessageList(SHOPGATE_CART_UPDATE_PRODUCTS, result.messages)
          ));
          return;
        }

        dispatch(successUpdateProductsInCart());
      })
      .catch((error) => {
        dispatch(errorUpdateProductsInCart(
          updateData,
          createPipelineErrorList(SHOPGATE_CART_UPDATE_PRODUCTS, error)
        ));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(updateProductsInCart);
