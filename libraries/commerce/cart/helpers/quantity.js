import { PRODUCT_UNIT_EACH } from '@shopgate/engage/product/constants';

/**
 * Returns the amount of items are counted towards the
 * displayed cart quantity.
 * @param {Object} product The product object.
 * @param {Array} cartItems Existing cart items to check for.
 * @returns {number}
 */
export const getDisplayedProductQuantity = (
  {
    productId,
    product = {},
    fulfillment,
    quantity,
  },
  cartItems = []
) => {
  // Products with custom units like (kg, lbs, ..)
  // are counted as 1 per line item.
  if (product.unit && product.unit !== PRODUCT_UNIT_EACH) {
    // If product is already existing in cart we only count them once.
    const existingCartItem = cartItems.find((cartItem) => {
      const sameProduct = productId === cartItem.product.id;
      const sameFulfillmentMethod = fulfillment?.type === cartItem.fulfillment?.type
        && fulfillment?.location?.code === cartItem.fulfillment?.location?.code;
      return sameProduct && sameFulfillmentMethod;
    });

    if (!existingCartItem) {
      return 1;
    }

    return 0;
  }
  return quantity;
};
