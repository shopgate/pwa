import { DIRECT_SHIP } from '../../locations';

/**
 * Converts order line items to cart items
 * @param {Array} lineItems The line items to be converted
 * @return {Array}
 */
export const convertLineItemsToCartItems = (lineItems = []) => lineItems.map((lineItem) => {
  const {
    code: id,
    quantity,
    discountAmount,
    price: lineItemPrice,
    product,
    fulfillmentMethod,
    fulfillmentLocationCode,
  } = lineItem;

  const {
    code: productCode, price: productPrice, name, image,
  } = product;

  // TODO convert line item options to cart item properties
  const properties = [];
  const appliedDiscounts = [];
  const additionalInfo = [];
  const coupon = null;
  const messages = [];
  let fulfillmentMethods;
  let fulfillment;

  if (fulfillmentMethod !== DIRECT_SHIP) {
    fulfillmentMethods = [fulfillmentMethod];
    fulfillment = {
      method: fulfillmentMethod,
      location: {
        code: fulfillmentLocationCode,

      },
    };
  }

  return {
    id,
    quantity,
    coupon,
    messages,
    type: 'product',
    product: {
      id: productCode,
      featuredImageUrl: image ? `${image}&width=440&height=440&format=jpeg` : null,
      name,
      properties,
      appliedDiscounts,
      additionalInfo,
      price: {
        unit: productPrice,
        default: lineItemPrice,
        special: discountAmount || null,
        info: '',
      },
      fulfillmentMethods,
    },
    fulfillment,
    fulfillmentLocationId: fulfillmentLocationCode,
  };
});
