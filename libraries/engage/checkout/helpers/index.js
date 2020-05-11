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
    salePrice,
    price: lineItemPrice,
    product,
    fulfillmentMethod,
    fulfillmentLocationCode,
  } = lineItem;

  const {
    code: productCode,
    price: productPrice,
    salePrice: productSalePrice,
    name,
    image,
    unit,
    options,
  } = product;

  let properties = [];
  const appliedDiscounts = [];
  const additionalInfo = [];
  const coupon = null;
  const messages = [];
  let fulfillmentMethods;
  let fulfillment;

  if (Array.isArray(options)) {
    properties = options.map(option => ({
      label: option.name,
      value: option.values[0].name,
    }));
  }

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
      featuredImageUrl: image ? `${image}&width=440&height=440&format=jpeg&fill=fff` : null,
      name,
      properties,
      appliedDiscounts,
      additionalInfo,
      unit,
      price: {
        unit: productPrice,
        unitSpecial: productSalePrice,
        default: lineItemPrice,
        special: salePrice || null,
        info: '',
      },
      fulfillmentMethods,
    },
    fulfillment,
    fulfillmentLocationId: fulfillmentLocationCode,
  };
});
