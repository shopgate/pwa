import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import { getFulfillmentSchedulingEnabled } from '@shopgate/engage/core/selectors';
import { forceOpenFulfillmentSlotDialog } from '@shopgate/engage/locations/components/FulfillmentSlotSwitcher/FulfillmentSlotProvider';
import {
  ROPIS,
  BOPIS,
} from '@shopgate/engage/locations/constants';
import { SHOPGATE_CART_ADD_PRODUCTS } from '../constants/Pipelines';
import createPipelineErrorList from '../helpers/createPipelineErrorList';
import { ECART } from '../constants/PipelineErrors';
import addProductsToCart from '../action-creators/addProductsToCart';
import successAddProductsToCart from '../action-creators/successAddProductsToCart';
import errorAddProductsToCart from '../action-creators/errorAddProductsToCart';
import setCartProductPendingCount from '../action-creators/setCartProductPendingCount';
import {
  getProductPendingCount, getAddToCartMetadata, getCartItems, getActiveFulfillmentSlot,
} from '../selectors';
import { getProduct } from '../../product/selectors/product';

import { messagesHaveErrors, createErrorMessageList } from '../helpers';
import { getDisplayedProductQuantity } from '../helpers/quantity';

/**
 * Adds products to the cart.
 * @param {Array} data The options for the products to be added.
 * @return {Function} A redux thunk.
 */
function addToCart(data) {
  return async (dispatch, getState) => {
    const state = getState();
    const preCartItems = getCartItems(state);
    const fulfillmentScheduling = getFulfillmentSchedulingEnabled(state);

    const pendingProductCount = getProductPendingCount(state);
    let quantity = 0;

    let products = data.map((product) => {
      const productData = getProduct(state, { productId: product.productId }) || {};

      // Count quantity for pending count.
      quantity += getDisplayedProductQuantity(
        {
          ...product,
          product: productData,
        },
        preCartItems
      );

      // Restructure into a productId and a variantId (only productId if not adding a variant)
      const productId = productData.baseProductId || product.productId;
      const variantId = productData.baseProductId ? productData.id : undefined;
      const metadata = getAddToCartMetadata(state, {
        productId,
        variantId,
      });

      // Return the current product if it already had metadata, otherwise add some, if any available
      return (product.metadata && product) || {
        ...product,
        ...metadata && { metadata },
      };
    });

    const needsScheduling = products
      .some(product => [ROPIS, BOPIS].includes(product?.fulfillment?.method));

    // Enrich with fulfillment scheduling data.
    if (needsScheduling && fulfillmentScheduling) {
      let fulfillmentSlot = getActiveFulfillmentSlot(state);

      // Make sure that a fulfillment slot has been chosen first!
      if (!fulfillmentSlot) {
        fulfillmentSlot = await forceOpenFulfillmentSlotDialog();
      }

      // Enrich slot id to fulfillment settings of all line items.
      products = products.map((product) => {
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

    // Dispatch pipeline request.
    dispatch(addProductsToCart(products));
    dispatch(setCartProductPendingCount(pendingProductCount + quantity));

    const request = new PipelineRequest(SHOPGATE_CART_ADD_PRODUCTS)
      .setInput({ products })
      .setResponseProcessed(PROCESS_SEQUENTIAL)
      .setRetries(0)
      .setErrorBlacklist(ECART)
      .dispatch();

    try {
      const result = await request;
      if (result.messages && messagesHaveErrors(result.messages)) {
        /**
         * @deprecated: The property "messages" is not supposed to be part of the
         * pipeline response. Specification demands errors to be returned as response
         * object with an "error" property. This code snippet needs to be removed after
         * fixing the `@shopgate/legacy-cart` extension.
         */
        dispatch(errorAddProductsToCart(
          products,
          createErrorMessageList(SHOPGATE_CART_ADD_PRODUCTS, result.messages)
        ));
        return result;
      }

      dispatch(successAddProductsToCart());
      return result;
    } catch (error) {
      dispatch(errorAddProductsToCart(
        products,
        createPipelineErrorList(SHOPGATE_CART_ADD_PRODUCTS, error)
      ));
      return null;
    }
  };
}

/** @mixes {MutableFunction} */
export default mutable(addToCart);
