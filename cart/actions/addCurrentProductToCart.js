/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Event from '@shopgate/pwa-core/classes/Event';
import { EVENT_ADD_TO_CART_MISSING_VARIANT } from '../constants';
import { getCurrentProduct } from '../../product/selectors/product';
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
    dispatch(addProductsToCart([{
      productId,
      quantity,
    }]));
  } else {
    Event.call(EVENT_ADD_TO_CART_MISSING_VARIANT);
  }
};

export default addCurrentProductToCart;
