import Event from '@shopgate/pwa-core/classes/Event';
import { EVENT_ADD_TO_CART_MISSING_VARIANT } from '../constants';
import { getCurrentProduct } from '../../product/selectors/product';
import {
  getAddToCartOptions,
  getAddToCartMetadata,
} from '../selectors';
import addProductsToCart from './addProductsToCart';

/**
 * Adds the current product to the cart.
 * @return {Function} A redux thunk.
 */
const addCurrentProductToCart = () => (dispatch, getState) => {
  const state = getState();
  const { quantity, productVariantId } = state.product.currentProduct;
  const product = getCurrentProduct(state);

  let productId = null;

  if (!product.flags.hasVariants) {
    productId = product.id;
  } else if (productVariantId) {
    productId = productVariantId;
  }

  if (productId) {
    const options = getAddToCartOptions(state);
    const metadata = getAddToCartMetadata(state, productId, productVariantId);

    dispatch(addProductsToCart([{
      productId,
      quantity,
      ...(options) && { options },
      ...(metadata) && { metadata },
    }]));
  } else {
    Event.call(EVENT_ADD_TO_CART_MISSING_VARIANT);
  }
};

export default addCurrentProductToCart;
