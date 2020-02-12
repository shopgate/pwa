/**
 * Group cart items for view
 * @param {Object[]} cartItems cartItems
 * @returns {Object} The grouped cart items.
 */
export function groupCartItems(cartItems) {
  return cartItems.reduce((acc, cartItem) => {
    const { fulfillment = null } = cartItem;
    const { location: { code } = {} } = fulfillment || {};

    let groupType = cartItem.type;
    if (code) {
      groupType = code;
    }

    if (!acc[groupType]) {
      acc[groupType] = {
        fulfillmentLocationId: code,
        items: [],
      };
    }

    acc[groupType].items.push(cartItem);
    return acc;
  }, {});
}
