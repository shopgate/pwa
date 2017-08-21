import Event from '@shopgate/pwa-core/classes/Event';
import { ADD_TO_CART_MISSING_VARIANT } from '../constants';
import { getCurrentProduct } from '../../product/selectors';
import { addProductsToCart } from '../actions';

/**
 * Adds the current product to the cart.
 * @return {Function} A redux thunk.
 */
const addCurrentProductToCart = () => (dispatch, getState) => {
  const state = getState();
  const { quantity, productVariantId } = state.currentProduct;
  const product = getCurrentProduct(state);

  let productId = null;

  if (!product.flags.hasVariants) {
    productId = product.id;
  } else if (productVariantId) {
    productId = productVariantId;
  }

  if (productId) {
    dispatch(addProductsToCart([{
      productId,
      quantity,
    }]));
  } else {
    Event.call(ADD_TO_CART_MISSING_VARIANT);
  }
};

export default addCurrentProductToCart;
