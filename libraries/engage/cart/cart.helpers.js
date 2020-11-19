import groupBy from 'lodash/groupBy';
import { ROPIS, BOPIS } from '../locations';

/**
 * @param {Array} cartItems The cart items to sort.
 * @returns {Array}
 */
export function sortCartItems(cartItems) {
  const grouped = groupBy(cartItems, 'type');
  const sorted = Object.keys(grouped).reduce((acc, key) => ([
    ...acc,
    ...grouped[key].sort((a, b) => Math.sign(!!b.fulfillment - !!a.fulfillment)),
  ]), []);

  const ropeItem = sorted
    .filter(item => item.fulfillment && [ROPIS, BOPIS].includes(item.fulfillment.method))
    .sort((a, b) => {
      if (a.fulfillment.location.code < b.fulfillment.location.code) return 1;
      if (a.fulfillment.location.code > b.fulfillment.location.code) return -1;
      return 0;
    });
  const directItem = sorted.filter(
    item => !item.fulfillment || ![ROPIS, BOPIS].includes(item.fulfillment.method)
  );

  const merged = [...ropeItem, ...directItem];

  const enhanced = merged.map((item) => {
    if (!item.fulfillment || ![ROPIS, BOPIS].includes(item.fulfillment.method)) {
      return {
        ...item,
        fulfillmentLocationId: null,
        fulfillmentMethod: null,
      };
    }

    return {
      ...item,
      fulfillmentLocationId: item.fulfillment.location.code,
      fulfillmentMethod: item.fulfillment.method,
    };
  });

  return enhanced;
}

/**
 * @param {Object} cartItem A cart item
 * @returns {Object}
 */
export const createCartItemPrices = (cartItem = {}) => {
  const {
    product = {}, quantity, price, promoAmount, extendedPrice, unitPromoAmount, unitDiscountAmount,
  } = cartItem;
  const {
    unit, unitSale, unitEffective,
  } = product?.price || {};

  const prices = {
    price: [{ price: unit }],
    subtotal: [],
  };

  if (unitSale) {
    prices.price.push({ price: unitSale });
    prices.subtotal.push({ price: unit * quantity });
  }

  prices.subtotal.push({ price });

  if (unitPromoAmount) {
    prices.price.push({
      price: unitEffective + unitPromoAmount,
      isPromo: true,
    });
    prices.subtotal.push({
      price: price + promoAmount,
      isPromo: true,
    });
  }

  if (unitDiscountAmount) {
    prices.price.push({
      price: unitEffective + unitPromoAmount + unitDiscountAmount,
      isCoupon: true,
    });
    prices.subtotal.push({
      price: extendedPrice,
      isCoupon: true,
    });
  }

  return prices;
};
