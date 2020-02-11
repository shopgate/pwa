import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { PROCESS_SEQUENTIAL } from '@shopgate/pwa-core/constants/ProcessTypes';
import { mutable } from '@shopgate/pwa-common/helpers/redux';
import { SHOPGATE_CART_ADD_PRODUCTS } from '../constants/Pipelines';
import createPipelineErrorList from '../helpers/createPipelineErrorList';
import { ECART } from '../constants/PipelineErrors';
import addProductsToCart from '../action-creators/addProductsToCart';
import successAddProductsToCart from '../action-creators/successAddProductsToCart';
import errorAddProductsToCart from '../action-creators/errorAddProductsToCart';
import setCartProductPendingCount from '../action-creators/setCartProductPendingCount';
import { getProductPendingCount, getAddToCartMetadata } from '../selectors';
import { getProduct } from '../../product/selectors/product';
import { messagesHaveErrors } from '../helpers';

/**
 * Adds products to the cart.
 * @param {Array} data The options for the products to be added.
 * @return {Function} A redux thunk.
 */
function addToCart(data) {
  return (dispatch, getState) => {
    const state = getState();

    const pendingProductCount = getProductPendingCount(state);
    let quantity = 0;

    const products = data.map((product) => {
      quantity += product.quantity;

      const productData = getProduct(state, { productId: product.productId }) || {};

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

    dispatch(addProductsToCart(products));
    dispatch(setCartProductPendingCount(pendingProductCount + quantity));

    const request = new PipelineRequest(SHOPGATE_CART_ADD_PRODUCTS)
      .setInput({ products })
      .setResponseProcessed(PROCESS_SEQUENTIAL)
      .setRetries(0)
      .setErrorBlacklist(ECART)
      .dispatch();

    request
      .then((result) => {
        if (result.messages && messagesHaveErrors(result.messages)) {
          /**
           * @deprecated: The property "messages" is not supposed to be part of the
           * pipeline response. Specification demands errors to be returned as response
           * object with an "error" property. This code snippet needs to be removed after
           * fixing the `@shopgate/legacy-cart` extension.
           */
          dispatch(errorAddProductsToCart(products, result.messages));
          return;
        }

        dispatch(successAddProductsToCart());
      })
      .catch((error) => {
        dispatch(errorAddProductsToCart(
          products,
          createPipelineErrorList(SHOPGATE_CART_ADD_PRODUCTS, error)
        ));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(addToCart);
