import groupBy from 'lodash/groupBy';
import { hasNewServices } from '@shopgate/engage/core/helpers';
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

  let merged = [...ropeItem, ...directItem];

  // Group splitted line items - try to keep the original order intact as much as possible
  const groupedByBaseLineItemId = groupBy(merged, e => e.baseLineItemId || e.id);
  merged = merged.reduce((acc, { id }) => {
    const group = groupedByBaseLineItemId?.[id];

    if (group) {
      return [
        ...acc,
        ...group,
      ];
    }

    return acc;
  }, []);

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
  /**
   * When PWA doesn't run with new services and uses a "shopgate.cart.getCart.v1" pipeline from one
   * of the available cart extensions, we return a price array based on the response of those
   * pipelines.
   */
  if (!hasNewServices()) {
    const { product: { price = {} } = {} } = cartItem;

    return {
      price: [],
      subtotal: typeof price?.special === 'number' && price.special !== price.default ? [
        { price: price.default },
        { price: price.special },
      ] : [
        { price: price.default },
      ],
    };
  }

  /**
   * When running with the new services, the "shopgate.cart.getCart.v1" pipeline returns entities
   * with different price properties. Those are handled here.
   */

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

  if (unitSale && unitSale !== unit) {
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
