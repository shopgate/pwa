import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import configuration from '@shopgate/pwa-common/collections/Configuration';
import { PIPELINES } from '@shopgate/pwa-common/constants/Configuration';
import { getFulfillmentSchedulingEnabled } from '@shopgate/engage/core/selectors';
import { forceOpenFulfillmentSlotDialog } from '@shopgate/engage/locations/components/FulfillmentSlotSwitcher/FulfillmentSlotProvider';
import {
  ROPIS,
  BOPIS,
} from '@shopgate/engage/locations/constants';
import { getActiveFulfillmentSlot } from '../selectors';
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
  return async (dispatch, getState) => {
    const {
      [SHOPGATE_CART_UPDATE_PRODUCTS]: pipeline = SHOPGATE_CART_UPDATE_PRODUCTS,
    } = configuration.get(PIPELINES, {});

    const state = getState();
    const fulfillmentScheduling = getFulfillmentSchedulingEnabled(state);
    let cartItems = updateData || [];

    const needsScheduling = cartItems
      .some(product => [ROPIS, BOPIS].includes(product?.fulfillment?.method) &&
          !product?.fulfillment?.slotId);

    // Enrich with fulfillment scheduling data.
    if (needsScheduling && fulfillmentScheduling) {
      let fulfillmentSlot = getActiveFulfillmentSlot(state);

      // Make sure that a fulfillment slot has been chosen first!
      if (!fulfillmentSlot) {
        fulfillmentSlot = await forceOpenFulfillmentSlotDialog();
      }

      // Enrich slot id to fulfillment settings of all line items.
      cartItems = cartItems.map((product) => {
        const isRope = [ROPIS, BOPIS].includes(product?.fulfillment?.method);

        return ({
          ...product,
          fulfillment: product.fulfillment ? {
            ...product.fulfillment,
            slotId: isRope ? fulfillmentSlot.id : undefined,
            location: isRope ? product.fulfillment?.location : undefined,
          } : undefined,
        });
      });
    }

    dispatch(updateProducts(cartItems));

    const request = new PipelineRequest(pipeline)
      .setInput({ cartItems })
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
            cartItems,
            createErrorMessageList(SHOPGATE_CART_UPDATE_PRODUCTS, result.messages)
          ));
          return;
        }

        dispatch(successUpdateProductsInCart());
      })
      .catch((error) => {
        dispatch(errorUpdateProductsInCart(
          cartItems,
          createPipelineErrorList(SHOPGATE_CART_UPDATE_PRODUCTS, error)
        ));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(updateProductsInCart);
