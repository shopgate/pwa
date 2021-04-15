import { getFulfillmentSchedulingEnabled } from '@shopgate/engage/core/selectors';
import { getPreferredLocation } from '@shopgate/engage/locations';
import { forceOpenFulfillmentSlotDialog } from '@shopgate/engage/locations/components/FulfillmentSlotSwitcher/FulfillmentSlotProvider';
import {
  ROPIS,
  BOPIS,
} from '@shopgate/engage/locations/constants';
import {
  getActiveFulfillmentSlot,
  getActiveFulfillmentSlotLocationCode,
} from '@shopgate/engage/cart/cart.selectors';

/**
 *
 * @param {Object} state The current state
 * @param {Array} products An array of products
 * @returns {Array}
 */
export const handleFulfillmentSlots = async (state, products) => {
  const needsScheduling = products
    .some(product => [ROPIS, BOPIS].includes(product?.fulfillment?.method));

  const fulfillmentScheduling = getFulfillmentSchedulingEnabled(state);

  if (!needsScheduling || !fulfillmentScheduling) {
    return products;
  }

  let activeFulfillmentSlot = getActiveFulfillmentSlot(state);
  const activeSlotLocationCode = getActiveFulfillmentSlotLocationCode(state);
  const preferredLocationCode = getPreferredLocation(state)?.code;

  // Make sure that a fulfillment slot has been chosen first!
  if (!activeFulfillmentSlot || (activeSlotLocationCode !== preferredLocationCode)) {
    activeFulfillmentSlot = await forceOpenFulfillmentSlotDialog('test');
  }

  // Enrich slot id to fulfillment settings of all line items.
  const result = products.map((product) => {
    const isRope = [ROPIS, BOPIS].includes(product?.fulfillment?.method);

    return ({
      ...product,
      fulfillment: product.fulfillment ? {
        ...product.fulfillment,
        slotId: isRope ? activeFulfillmentSlot.id : undefined,
        location: isRope ? product.fulfillment?.location : undefined,
      } : undefined,
    });
  });

  return result;
};
