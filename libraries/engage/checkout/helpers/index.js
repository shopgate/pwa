import { DIRECT_SHIP, ROPIS } from '../../locations';

/**
 * Converts order line items to cart items
 * @param {Array} lineItems The line items to be converted
 * @return {Array}
 */
export const convertLineItemsToCartItems = (lineItems = []) => lineItems.map((lineItem) => {
  const {
    code: id,
    quantity,
    orderedQuantity = null,
    salePrice,
    price: lineItemPrice,
    product,
    status,
    subStatus,
    fulfillmentMethod,
    fulfillmentLocationCode,
    substitutionAllowed,
  } = lineItem;

  const {
    code: productCode,
    price: productPrice,
    salePrice: productSalePrice,
    name,
    image,
    unit,
    hasCatchWeight = false,
    options,
  } = product;

  let properties = [];
  const appliedDiscounts = [];
  const additionalInfo = [];
  const coupon = null;
  const messages = [];
  let fulfillmentMethods;
  let fulfillment;
  let featuredImageUrl = null;

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

  if (image) {
    if (image.includes('?')) {
      featuredImageUrl = `${image}&width=440&height=440&format=jpeg&fill=fff`;
    } else {
      featuredImageUrl = `${image}?width=440&height=440&format=jpeg&fill=fff`;
    }
  }

  return {
    id,
    quantity,
    orderedQuantity,
    coupon,
    messages,
    type: 'product',
    status,
    subStatus,
    product: {
      id: productCode,
      featuredImageUrl,
      name,
      properties,
      appliedDiscounts,
      additionalInfo,
      unit,
      hasCatchWeight,
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
    substitutionAllowed,
  };
});

/**
 * Generates checkout tax lines from an order object.
 * @param {Object} order An order object
 * @returns {Array}
 */
export const getCheckoutTaxLinesFromOrder = (order = {}) => [
  {
    visible: true,
    type: 'subTotal',
    value: order.subTotal,
    currencyCode: order.currencyCode,
  },
  {
    visible: order.taxAmount > 0,
    type: 'tax',
    value: order.taxAmount,
    currencyCode: order.currencyCode,
  },
  {
    visible: true,
    type: 'total',
    value: order.total,
    currencyCode: order.currencyCode,
  },
];

/**
 * Checks if an order is a reserve only order
 * @param {Object} order An order object
 * @returns {boolean}
 */
export const isReserveOnlyOrder = (order = {}) => {
  const nonReserveItem = order.lineItems.find(
    lineItem => lineItem.fulfillmentMethod !== ROPIS
  );

  return !nonReserveItem;
};
