import { i18n } from '@shopgate/engage/core';
import { DIRECT_SHIP, ROPIS } from '@shopgate/engage/locations';

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
    promoAmount,
    extendedPrice,
    discountAmount,
    unitDiscountAmount,
    unitPromoAmount,
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
    effectivePrice: productEffectivePrice,
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
        unitSale: productSalePrice,
        unitEffective: productEffectivePrice,
        info: '',
      },
      fulfillmentMethods,
    },
    unitPromoAmount,
    unitDiscountAmount,
    price: lineItemPrice,
    extendedPrice,
    promoAmount,
    discountAmount,
    fulfillment,
    fulfillmentLocationId: fulfillmentLocationCode,
    substitutionAllowed,
  };
});

/**
 * Extracts the promotions without coupon from the order.
 * @param {Object} order An order object
 * @returns {Array}
 */
const getPromotionsFromOrder = (order = {}) => {
  const { appliedPromotions = [] } = order;
  return appliedPromotions.filter(({ coupon }) => !coupon);
};

/**
 * Extracts the coupons from the order.
 * @param {Object} order An order object
 * @returns {Array}
 */
const getCouponsFromOrder = (order = {}) => {
  const { appliedPromotions = [], coupons = [], lineItems = [] } = order;

  return coupons.filter((coupon) => {
    // Filter coupons which are assigned to line items
    const code = coupon?.code;

    const lineItemCoupon = lineItems.find((cartItem) => {
      const lineItemPromotions = cartItem?.appliedPromotions || [];
      const match = lineItemPromotions.find((promotion) => {
        const lineItemCouponCode = promotion?.coupon?.code;
        return lineItemCouponCode === code;
      });

      return !!match;
    });

    return !lineItemCoupon;
  }).map((coupon) => {
    const code = coupon?.promotion?.code;
    const promotion = appliedPromotions.find(promotionEntry => promotionEntry.code === code);

    return {
      ...coupon,
      promotion: {
        ...coupon?.promotion || {},
        ...promotion,
      },
    };
  });
};

/**
 * Generates the coupon lines from an order
 * @param {Object} order An order object
 * @returns {Array}
 */
export const getCouponLinesFromOrder = (order = {}) =>
  getCouponsFromOrder(order).map(coupon => ({
    visible: true,
    type: 'coupon',
    label: coupon?.code ? i18n.text('cart.coupon_label', { label: coupon.code }) : '',
    value: coupon?.promotion?.discount?.absoluteAmount || null,
    currencyCode: order.currencyCode,
    messages: coupon?.messages || null,
    info: coupon?.promotion?.promotionalText || null,
  }));

/**
 * Generates the promotion lines from an order
 * @param {Object} order An order object
 * @returns {Array}
 */
export const getPromotionLinesFromOrder = (order = {}) =>
  getPromotionsFromOrder(order).map(promotion => ({
    visible: true,
    type: 'promotion',
    label: promotion?.name,
    value: promotion?.discount?.absoluteAmount || 0,
    currencyCode: order.currencyCode,
    messages: null,
    info: promotion?.promotionalText || null,
  }));

/**
 * Generates checkout tax lines from an order object.
 * @param {Object} order An order object
 * @returns {Array}
 */
export const getCheckoutTaxLinesFromOrder = (order = {}) => {
  const hasDirectShipItems = !!(order?.lineItems || []).find(
    lineItem => lineItem?.fulfillmentMethod === DIRECT_SHIP
  );
  const hasSelectedShippingMethod = !!(order?.addressSequences || []).find(
    address =>
      address?.type === 'shipping' &&
      !!address?.orderSegment?.selectedShippingMethod
  );

  return [
    {
      visible: true,
      type: 'subTotal',
      label: null,
      value: order.subTotal || 0,
      currencyCode: order.currencyCode,
    },
    ...getPromotionLinesFromOrder(order),
    ...getCouponLinesFromOrder(order),
    {
      visible: hasDirectShipItems && hasSelectedShippingMethod,
      type: 'shippingTotal',
      label: null,
      value: order.shippingTotal || 0,
      currencyCode: order.currencyCode,
    },
    {
      visible: order.taxAmount > 0,
      type: 'tax',
      label: null,
      value: order.taxAmount || 0,
      currencyCode: order.currencyCode,
    },
    {
      visible: true,
      type: 'total',
      label: null,
      value: order.total || 0,
      currencyCode: order.currencyCode,
    },
  ];
};

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

