import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { logger } from '@shopgate/pwa-core/helpers';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import * as pipelines from '../constants/Pipelines';
import createPipelineErrorList from '../helpers/createPipelineErrorList';
import { ECART } from '../constants/PipelineErrors';
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
    .setErrorBlacklist(ECART)
    .dispatch()
    .then(({ messages }) => {
      /**
       * @deprecated: The property "messages" is not supposed to be part of the pipeline response.
       * Specification demands errors to be returned as response object with an "error" property.
       * This code snippet needs to be removed after fixing the `@shopgate/legacy-cart` extension.
       */
      if (messages && messagesHaveErrors(messages)) {
        dispatch(errorUpdateProductsInCart(updateData, messages));
        return;
      }

      dispatch(successUpdateProductsInCart());
    })
    .catch((error) => {
      dispatch(errorUpdateProductsInCart(
        updateData,
        createPipelineErrorList(pipelines.SHOPGATE_CART_UPDATE_PRODUCTS, error)
      ));
      logger.error(pipelines.SHOPGATE_CART_UPDATE_PRODUCTS, error);
    });
};

/** @mixes {MutableFunction} */
export default mutable(updateProductsInCart);
