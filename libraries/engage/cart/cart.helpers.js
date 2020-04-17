// @flow
import groupBy from 'lodash/groupBy';
import { ROPIS, BOPIS } from '../locations';
import { type Item } from './cart.types';

/**
 * @param {Array} cartItems The cart items to sort.
 * @returns {Array}
 */
export function sortCartItems(cartItems: Item[]) {
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

  const enhanced = merged.map<any>((item) => {
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
